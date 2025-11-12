import os
import json
import traceback
from typing import Any
import boto3
import pandas as pd
from datetime import datetime, timedelta

# 상수 정의
DEFAULT_HZ = 10
API_TIMEOUT_SECONDS = 10
DEFAULT_PLAYER_TYPE = 'amateur'

try:
    import pymysql
    HAS_PYMYSQL = True
except ImportError:
    HAS_PYMYSQL = False
    print("[Lambda] pymysql not available, using Django API for all queries")

s3 = boto3.client('s3')

def _download_s3(bucket: str, key: str, local_name: str) -> str:
    path = f"/tmp/{local_name}"
    s3.download_file(bucket, key, path)
    return path

def _db():
    if not HAS_PYMYSQL:
        raise RuntimeError("pymysql not available")
    return pymysql.connect(
        host=os.environ['DB_HOST'],
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD'],
        database=os.environ['DB_NAME'],
        autocommit=False,
        cursorclass=pymysql.cursors.DictCursor,
        charset='utf8mb4'
    )

def _fetch_ground_config(conn, ground_code=None, ground_name=None):
    with conn.cursor() as cur:
        if ground_code:
            cur.execute("""
                SELECT ground_code, name, new_short, new_long, rotate_deg, center
                FROM ground_info
                WHERE ground_code=%s AND deleted_at IS NULL LIMIT 1
            """, (ground_code,))
        else:
            cur.execute("""
                SELECT ground_code, name, new_short, new_long, rotate_deg, center
                FROM ground_info
                WHERE name=%s AND deleted_at IS NULL LIMIT 1
            """, (ground_name,))
        row = cur.fetchone()
        if not row:
            raise ValueError("ground_info not found")
    
    def _json_or_list(val):
        if val is None:
            return None
        if isinstance(val, (list, tuple)):
            return list(val)
        try:
            return json.loads(val)
        except Exception:
            return None
    
    center_json = _json_or_list(row.get("center"))
    center_lat = center_json[0] if center_json and len(center_json) >= 2 else 0.0
    center_lon = center_json[1] if center_json and len(center_json) >= 2 else 0.0
    
    return {
        "ground_code": row.get("ground_code"),
        "ground_name": row.get("name"),
        "new_short": _json_or_list(row.get("new_short")),
        "new_long": _json_or_list(row.get("new_long")),
        "rotate_deg": float(row.get("rotate_deg") or 0.0),
        "center": center_json,
        "center_lat": float(center_lat),
        "center_lon": float(center_lon),
    }

def _upsert_player_anal(conn, quarter_code: str, flat: dict):
    with conn.cursor() as cur:
        cur.execute("SHOW COLUMNS FROM player_anal")
        cols = {r['Field'] for r in cur.fetchall()}
    data = {k: v for k, v in flat.items() if k in cols}
    data['quarter_code'] = quarter_code
    keys = list(data.keys())
    cols_sql = ", ".join(f"`{k}`" for k in keys)
    vals_sql = ", ".join(["%s"] * len(keys))
    upd_sql = ", ".join([f"`{k}`=VALUES(`{k}`)" for k in keys if k != 'quarter_code'])
    sql = f"INSERT INTO player_anal ({cols_sql}) VALUES ({vals_sql}) ON DUPLICATE KEY UPDATE {upd_sql}"
    with conn.cursor() as cur:
        cur.execute(sql, [data[k] for k in keys])

def _post_ai_summary(quarter_code: str, summary: dict):
    import urllib.request
    url = os.environ.get('BACKEND_AI_INGEST_URL')
    token = os.environ.get('SERVICE_TOKEN')
    if not url: 
        return
    req = urllib.request.Request(
        url=url,
        data=json.dumps({"quarter_code": quarter_code, "summary": summary}).encode("utf-8"),
        headers={"Content-Type": "application/json", **({"Authorization": f"Bearer {token}"} if token else {})},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=API_TIMEOUT_SECONDS) as r:
            r.read()
    except Exception:
        pass

def _fetch_upload_hz(conn, upload_code: str, default_hz: int = DEFAULT_HZ) -> int:
    """
    Upload 테이블에서 Hz 값 조회 (Legacy - 현재는 이벤트에서 직접 전달받음)
    
    Note: 백엔드에서 이미 조회하여 전달하므로 이 함수는 더 이상 사용되지 않음
    """
    with conn.cursor() as cur:
        cur.execute("SELECT hz FROM upload WHERE upload_code=%s LIMIT 1", (upload_code,))
        row = cur.fetchone()
        if row and row.get('hz') is not None:
            try:
                return int(row['hz'])
            except Exception:
                return default_hz
    return default_hz

def _to_json_safe(value: Any):
    import numpy as _np
    import pandas as _pd
    from datetime import datetime as _dt
    
    if value is None:
        return None
    
    if isinstance(value, (_np.integer,)):
        return int(value)
    if isinstance(value, (_np.floating,)):
        v = float(value)
        return None if _np.isnan(v) or _np.isinf(v) else v
    if isinstance(value, (_np.bool_,)):
        return bool(value)
    if isinstance(value, (_pd.Timestamp,)):
        return value.to_pydatetime().isoformat()
    if isinstance(value, (_dt,)):
        return value.isoformat()
    if isinstance(value, dict):
        return {str(k): _to_json_safe(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [_to_json_safe(v) for v in value]
    
    try:
        import decimal as _decimal
        if isinstance(value, _decimal.Decimal):
            return float(value)
    except Exception:
        pass
    
    try:
        json.dumps(value)
        return value
    except Exception:
        return str(value)


def _simple_keypoints(flat: dict) -> dict:
    return {
        "distance_km": flat.get("T_D", 0),
        "avg_speed_kmh": flat.get("T_AS", 0),
        "max_speed_kmh": flat.get("T_HS", 0)
    }

def _create_analysis_completed_notification(user_code: str, match_code: str, upload_code: str, metadata: dict | None = None):
    """
    분석 완료 시 백엔드 API를 호출하여 알림을 생성합니다.
    """
    metadata = metadata or {}
    django_api_url = os.environ.get('DJANGO_API_URL')
    if not django_api_url:
        print("[Lambda] 분석 완료 알림 생성 실패: DJANGO_API_URL 미설정")
        return
    
    endpoint = f"{django_api_url}/api/anal/create-analysis-notification/"
    payload = {
        "user_code": user_code,
        "match_code": match_code,
        "upload_code": upload_code,
        "metadata": metadata
    }
    headers = {"Content-Type": "application/json"}
    service_token = os.environ.get('SERVICE_TOKEN')
    if service_token:
        headers["Authorization"] = f"Bearer {service_token}"
    
    try:
        import requests
        response = requests.post(
            endpoint,
            json=payload,
            headers=headers,
            timeout=API_TIMEOUT_SECONDS
        )
        if response.status_code in (200, 201):
            print(f"[Lambda] 분석 완료 알림 생성 성공 ({response.status_code})")
        else:
            print(f"[Lambda] 분석 완료 알림 생성 실패: {response.status_code} - {response.text}")
    except Exception as api_err:
        print(f"[Lambda] 분석 완료 알림 API 호출 실패: {api_err}")

def lambda_handler(event, context):
    try:
        # API Gateway 프록시 통합 처리: body가 문자열로 전달됨
        if 'body' in event and isinstance(event['body'], str):
            print("[Lambda] API Gateway 프록시 모드 감지, body 파싱 중...")
            event = json.loads(event['body'])
        
        # 디버깅: 받은 event 로그 출력
        print(f"[Lambda] Parsed event keys: {list(event.keys())}")
        
        user_code = event['user_code']
        upload_code = event['upload_code']
        ground_code = event['ground_code']
        match_code = event['match_code']
        rest_area_position = event['rest_area_position']  # "north" or "south"
        quarter_codes = event['quarter_codes']
        quarters = event['quarters']
        metadata = event.get('metadata', {})
        
        print(f"[Lambda] 휴식 공간 위치: '{rest_area_position}' (north=위쪽, south=아래쪽)")
        
        # DB에서 조회한 정보 사용 (백엔드에서 전달)
        player_type = event.get('player_type', DEFAULT_PLAYER_TYPE)
        hz_value = event.get('hz', DEFAULT_HZ)
        
        print(f"[Lambda] 선수 타입: {player_type}, GPS Hz: {hz_value}")
        
        bucket = os.environ.get('S3_BUCKET_NAME')
        upload_key = f"data/player/edit/{upload_code}.csv"
        raw_key = f"data/player/raw/{upload_code}.csv"
        
        print(f"분석 시작: user={user_code}, upload={upload_code}, ground={ground_code}, match={match_code}")
        
        edit_csv = _download_s3(bucket, upload_key, "edit.csv")
        try:
            raw_csv = _download_s3(bucket, raw_key, "raw.csv")
        except:
            raw_csv = None
            print("Raw 파일 없음, edit 파일만 사용")

        django_api_url = os.environ.get('DJANGO_API_URL')
        
        try:
            import requests
            ground_response = requests.get(
                f"{django_api_url}/api/ground/search/",
                params={'ground_code': ground_code},
                timeout=API_TIMEOUT_SECONDS
            )
            if ground_response.status_code == 200:
                ground_data = ground_response.json()
                ground = {
                    "ground_code": ground_data.get("ground_code"),
                    "ground_name": ground_data.get("name"),
                    "rotate_deg": float(ground_data.get("rotate_deg") or 0.0),
                    "center_lat": 0.0,
                    "center_lon": 0.0
                }
                print(f"Ground 정보 로드: {ground.get('ground_name')}")
            else:
                raise ValueError(f"Ground 정보 조회 실패: {ground_response.status_code}")
        except Exception as ground_error:
            print(f"Ground 조회 오류: {str(ground_error)}")
            ground = {
                "ground_code": ground_code,
                "ground_name": "Unknown",
                "rotate_deg": 0.0,
                "center_lat": 0.0,
                "center_lon": 0.0
            }
        quarters_for_analysis = []
        for i, quarter in enumerate(quarters):
            quarter_code = quarter_codes[i]
            start_time_str = quarter['start_time']
            end_time_str = quarter['end_time']
            
            start_dt = datetime.strptime(start_time_str, '%Y-%m-%d %H:%M:%S')
            end_dt = datetime.strptime(end_time_str, '%Y-%m-%d %H:%M:%S')
            if end_dt < start_dt:
                end_dt = end_dt + timedelta(days=1)
                end_time_str = end_dt.strftime('%Y-%m-%d %H:%M:%S')
            
            print(f"[Lambda] Quarter {i+1}: name={quarter['quarter_name']}, status={quarter['status']}, home={quarter.get('home')}, home_position={quarter.get('home_position')}")
            
            quarters_for_analysis.append({
                "quarter": quarter['quarter_name'],
                "quarter_code": quarter_code,
                "start_time": start_time_str,
                "end_time": end_time_str,
                "status": "출전" if quarter['status'] == 'play' else "미출전",
                "home": quarter['home'],
                "home_position": quarter.get('home_position'),
                "type": player_type
            })
        
        print(f"쿼터 {len(quarters_for_analysis)}개 분석 시작")
        
        # anal_cal 모듈 import
        try:
            import anal_cal as ac
            print("[Lambda] anal_cal 모듈 import 성공")
        except Exception as import_err:
            print(f"[Lambda] ❌ CRITICAL: anal_cal import 실패")
            print(f"[Lambda] 에러: {import_err}")
            traceback.print_exc()
            
            # PlayerMatch status를 'anal_fail'로 업데이트
            try:
                import requests
                update_response = requests.patch(
                    f"{django_api_url}/api/anal/update-match-status/",
                    json={
                        'match_code': match_code,
                        'status': 'anal_fail',
                        'error_message': f"분석 모듈 로드 실패: {str(import_err)}"
                    },
                    timeout=API_TIMEOUT_SECONDS
                )
                print(f"[Lambda] Match status 'anal_fail' 업데이트: {update_response.status_code}")
            except Exception as update_err:
                print(f"[Lambda] Match status 업데이트 실패: {update_err}")
            
            raise RuntimeError(f"anal_cal 모듈을 로드할 수 없습니다: {import_err}")

        results = {}
        
        try:
            print("[Lambda] anal_cal.player_anal() 실행 시작")
            ground_info_from_event = event.get('ground_info')
            
            if ground_info_from_event:
                print(f"[Lambda] 이벤트에서 Ground 정보 받음: {ground_info_from_event.get('name')}")
                gcfg = {
                    'ground_code': ground_code,
                    'ground_name': ground_info_from_event.get('name'),
                    'center': ground_info_from_event.get('center'),
                    'rotate_deg': ground_info_from_event.get('rotate_deg'),
                    'new_short': ground_info_from_event.get('new_short'),
                    'new_long': ground_info_from_event.get('new_long')
                }
            else:
                print("[Lambda] 이벤트에 ground_info 없음, DB에서 조회 시도")
                conn = None
                try:
                    conn = _db()
                    gcfg = _fetch_ground_config(conn, ground_code=ground_code)
                    print(f"[Lambda] DB에서 Ground 정보 조회 성공")
                except Exception as _e:
                    print(f"[Lambda] DB 조회 실패: {_e}")
                    gcfg = None
                finally:
                    try:
                        if conn:
                            conn.close()
                    except Exception:
                        pass

            # 이벤트에서 받은 Hz 값 사용 (DB 조회 불필요)
            hz_val = hz_value
            print(f"[Lambda] 사용할 Hz 값: {hz_val}")

            ground_dict = None
            if gcfg and gcfg.get('new_short') and gcfg.get('new_long'):
                ground_dict = {
                    "center": gcfg.get('center') or [
                        float(gcfg.get('center_lat') or 0.0),
                        float(gcfg.get('center_lon') or 0.0)
                    ],
                    "rotate_deg": float(gcfg.get('rotate_deg') or 0.0),
                    "new_short": gcfg.get('new_short'),
                    "new_long": gcfg.get('new_long')
                }
                print(f"[Lambda] Ground 정보 준비 완료: {gcfg.get('ground_name')}")
            else:
                print(f"[Lambda] Ground 정보 없음: {ground_code}")
                raise ValueError(f"Ground 정보를 찾을 수 없습니다: {ground_code}. 이벤트에 ground_info를 포함시켜주세요.")
            
            # 쿼터 시간을 pandas Timestamp로 변환
            import pandas as pd
            quarter_info_obj = {
                "quarters": [
                    {
                        "quarter": q['quarter'],
                        "start_time": pd.Timestamp(q['start_time']),
                        "end_time": pd.Timestamp(q['end_time']),
                        "status": q['status'],
                        "home": q['home']
                    }
                    for q in quarters_for_analysis
                ]
            }
            standard_dir = rest_area_position
            
            results = ac.player_anal(
                hz_val,
                raw_csv,
                edit_csv,
                ground_name=None,
                standard=standard_dir,
                quarter_info=quarter_info_obj,
                type=player_type,
                ground_dict=ground_dict
            )
            
            print(f"[Lambda] anal_cal 결과 키 개수: {len(results or {})}")
            safe_results = {}
            for k, v in (results or {}).items():
                safe_results[str(k)] = _to_json_safe(v)
            results = safe_results
            print(f"[Lambda] anal_cal.player_anal() 성공, 전체 지표 계산 완료")
                
        except Exception as ac_err:
            print(f"[Lambda] ❌ CRITICAL: anal_cal 실행 실패")
            print(f"[Lambda] 에러: {ac_err}")
            traceback.print_exc()
            
            # PlayerMatch status를 'anal_fail'로 업데이트
            try:
                import requests
                update_response = requests.patch(
                    f"{django_api_url}/api/anal/update-match-status/",
                    json={
                        'match_code': match_code,
                        'status': 'anal_fail',
                        'error_message': f"분석 실행 실패: {str(ac_err)}"
                    },
                    timeout=API_TIMEOUT_SECONDS
                )
                print(f"[Lambda] Match status 'anal_fail' 업데이트: {update_response.status_code}")
            except Exception as update_err:
                print(f"[Lambda] Match status 업데이트 실패: {update_err}")
            
            raise RuntimeError(f"분석 실행 중 오류 발생: {ac_err}")

        django_api_url = os.environ.get('DJANGO_API_URL')
        
        for q_info in quarters_for_analysis:
            quarter_code = q_info['quarter_code']
            qname = q_info['quarter']
            
            flat = results.get(qname, {}) or {}
            flat['AN_T'] = player_type
            
            print(f"쿼터 {qname} ({quarter_code}) Django API로 저장 중...")
            summary = {
                'T_D': flat.get('T_D'), 'T_T': flat.get('T_T'), 'T_AS': flat.get('T_AS'), 'T_HS': flat.get('T_HS'),
                'A_D': flat.get('A_D'), 'D_D': flat.get('D_D'),
                'point_total': flat.get('point_total'),
                'AN_T': flat.get('AN_T'),
                '총_필드수': len(flat)
            }
            print(f"[Lambda] 전송 데이터 요약: {summary}")
            
            try:
                import requests
                response = requests.post(
                    f"{django_api_url}/api/anal/save-result/",
                    json={'quarter_code': quarter_code, 'analysis_data': flat},
                    timeout=API_TIMEOUT_SECONDS
                )
                if response.status_code in [200, 201]:
                    print(f"{qname} 저장 완료")
                else:
                    print(f"{qname} 저장 실패: {response.status_code} - {response.text}")
            except Exception as api_error:
                print(f"API 호출 실패: {str(api_error)}")
        
        print("모든 쿼터 Django API로 전송 완료")

        # ===================================================================
        # 🆕 GPT 핵심 포인트 추출 및 PlayerAi 테이블 저장
        # ===================================================================
        try:
            print("\n" + "="*60)
            print("📊 GPT 핵심 포인트 추출 시작")
            print("="*60)
            
            # PlayerMatch status를 'ai'로 업데이트
            try:
                import requests
                update_response = requests.patch(
                    f"{django_api_url}/api/anal/update-match-status/",
                    json={
                        'match_code': match_code,
                        'status': 'ai'
                    },
                    timeout=API_TIMEOUT_SECONDS
                )
                print(f"  ✓ Match status 'ai' 업데이트: {update_response.status_code}")
            except Exception as update_err:
                print(f"  ⚠️ Match status 업데이트 실패: {update_err}")
            
            # 1) 쿼터별 분석 결과를 JSON 파일로 저장 (GPT 요약을 위해)
            import tempfile
            temp_dir = tempfile.mkdtemp(prefix="player_anal_")
            
            for q_info in quarters_for_analysis:
                qname = q_info['quarter']
                flat = results.get(qname, {}) or {}
                
                # JSON 파일 저장
                quarter_json_path = os.path.join(temp_dir, f"{qname}_result.json")
                with open(quarter_json_path, 'w', encoding='utf-8') as f:
                    json.dump(flat, f, ensure_ascii=False, indent=2)
                print(f"  ✓ {qname} 임시 JSON 저장: {quarter_json_path}")
            
            # 2) 모든 쿼터 요약 생성
            import summarize
            all_quarters_summary = ""
            quarter_names = ["1쿼터", "2쿼터", "3쿼터", "4쿼터"]
            
            for i, qname in enumerate(quarter_names):
                quarter_json_path = os.path.join(temp_dir, f"{qname}_result.json")
                if os.path.exists(quarter_json_path):
                    try:
                        quarter_summary = summarize.summarize_file(quarter_json_path)
                        if quarter_summary.strip():
                            all_quarters_summary += f"\n=== {qname} ===\n"
                            all_quarters_summary += quarter_summary + "\n"
                    except Exception as sum_err:
                        print(f"  ⚠️ {qname} 요약 실패: {sum_err}")
            
            print(f"  ✓ 전체 쿼터 요약 완료 (길이: {len(all_quarters_summary)} 자)")
            
            # 3) GPT로 핵심 포인트 추출
            import gpt
            
            # 사용자 정보 구성 (메타데이터에서 가져오거나 기본값 사용)
            user_info = metadata.get('user_info', f"선수 코드: {user_code}\n분석 타입: {player_type}\n")
            
            # GPT API 키 확인
            gpt_api_key = os.environ.get('GPT_API_KEY')
            if not gpt_api_key:
                print("  ⚠️ GPT_API_KEY 환경변수가 설정되지 않았습니다. GPT 처리 건너뜀")
                raise ValueError("GPT_API_KEY not configured")
            
            # GPT 처리를 위한 임시 디렉토리 구조 생성
            gpt_temp_dir = os.path.join(temp_dir, "gpt")
            os.makedirs(gpt_temp_dir, exist_ok=True)
            
            # p6_gpt 모듈에서 사용하는 파일 경로 형식으로 변환
            # (파일명만 사용, 경로는 내부에서 구성)
            base_file_name = match_code.replace('m_', 'p_')
            
            # GPT 프롬프트 구성
            # 1) 기본 톤 (폴백)
            prompt_talk_type_default = "친근하고 전문적인 스포츠 분석가 톤으로 답변해줘"
            prompt_talk_type = prompt_talk_type_default
            ai_type = None
            
            # 2) 사용자 설정 톤(UserInfo.ai_type) 조회 → 톤 매핑
            try:
                import requests
                ui_resp = requests.get(
                    f"{django_api_url}/api/user/get-user-info/",
                    params={"user_code": user_code},
                    timeout=API_TIMEOUT_SECONDS
                )
                if ui_resp.status_code == 200:
                    ui_json = ui_resp.json() or {}
                    ai_type = ui_json.get("ai_type")
                    
                    ai_type_to_tone = {
                        "strict_leader": "단호하고 명확한 코칭 톤으로, 목표 지향적으로 핵심만 짚어 설명해줘",
                        "emotional_support_girl": "따뜻하고 공감적인 여성 코치 톤으로, 격려 중심으로 친절하게 설명해줘",
                        "emotional_support_boy": "따뜻하고 공감적인 남성 코치 톤으로, 격려 중심으로 친절하게 설명해줘",
                        "mentor": "경험 많은 멘토 톤으로, 조언과 방향성을 제시하며 차분히 설명해줘",
                        "data_analyst": "데이터 분석가 톤으로, 객관적이고 수치 중심으로 명확하게 설명해줘",
                        "cheerleader": "열정적인 치어리더 톤으로, 긍정적이고 힘을 북돋는 말투로 설명해줘",
                        "casual_friend": "친한 친구 같은 가벼운 톤으로, 쉽게 풀어서 편하게 설명해줘",
                    }
                    
                    if isinstance(ai_type, str) and ai_type:
                        prompt_talk_type = ai_type_to_tone.get(ai_type, prompt_talk_type_default)
                else:
                    print(f"  ⚠️ UserInfo 조회 실패: {ui_resp.status_code} - {ui_resp.text}")
            except Exception as _ui_err:
                print(f"  ⚠️ UserInfo.ai_type 조회 중 오류: {_ui_err}")
            
            # 선택된 ai_type과 최종 톤 로그 출력
            print(f"[Lambda] UserInfo.ai_type 선택값: {ai_type}")
            print(f"[Lambda] 최종 톤(prompt_talk_type): {prompt_talk_type}")
            
            request_prompt = f"""
                ## 🎯 맥락 (CONTEXT)
                당신은 축구 선수의 GPS 데이터를 분석하여 경기력을 평가하는 전문 분석가입니다.
                제공된 쿼터별 데이터를 바탕으로 선수의 핵심 성과 포인트를 식별하고 설명해야 합니다.
                
                ## 👤 페르소나 (PERSONA)
                - 친근하고 전문적인 스포츠 분석가
                - 복잡한 데이터를 쉽게 설명하는 커뮤니케이터
                - 선수의 강점과 특징을 발견하는 전문가
                
                ## 📋 규칙 (RULES)
                1. 제공된 데이터에서 가장 눈에 띄는 5가지 핵심 포인트만 선별
                2. 각 포인트는 선수가 실제로 보여준 성과나 특징을 중심으로 설명
                3. 복잡한 용어는 쉽게 풀어서 설명
                4. 구체적인 수치와 함께 의미를 설명
                5. 공과 관련된 설명은 제외하고 순수한 움직임 데이터만 분석
                6. 제공된 지표 데이터에만 기반하여 설명 (추측이나 가정 금지)
                7. 리스트 구성은 쿼터 순서대로 정렬
                
                ## 📝 포함할 내용 (CONTENT)
                - 가장 인상적인 수치나 기록
                - 쿼터별로 눈에 띄는 변화나 특징
                - 선수의 강점이나 특별한 활동 패턴
                - 경기 흐름에 영향을 준 중요한 지표들
                - label은 자극적이고 흥미로운 제목으로 설정
                
                ## 🎨 어조 (TONE)
                - {prompt_talk_type}
                
                ## 📊 출력 형식 (FORMAT)
                반드시 아래 JSON 형식으로만 응답:
                {{
                    "key_points": [
                        {{"quarter": "해당쿼터", "label": "제목", "value": "값과 단위", "insight": "이 수치가 왜 중요한지, 선수가 어떤 모습을 보였는지 생생하게 설명"}},
                        {{"quarter": "...", "label": "...", "value": "...", "insight": "..."}}
                    ]
                }}
                
                **중요 - quarter 필드 작성 규칙:**
                quarter 필드에는 오직 쿼터 번호만 입력하세요. 다른 설명은 절대 포함하지 마세요.
                
                ✅ 올바른 예시:
                - "1쿼터"
                - "2쿼터" 
                - "3쿼터"
                - "4쿼터"
                - "1쿼터 vs 3쿼터" (비교 시)
                - "전체쿼터" (전체 패턴이나 추세 분석 시)
                
                ❌ 잘못된 예시:
                - "전반적 추세" (설명 포함 금지)
                - "안정적 페이스: 2쿼터" (설명 포함 금지)
                """
            
            # GPT API 직접 호출 (p6_gpt.main 로직 간소화 버전)
            from openai import OpenAI
            
            # GPT API 키는 환경변수 또는 JSON 파일에서 읽기
            try:
                # 먼저 환경변수 시도
                api_key = os.environ.get('GPT_API_KEY')
                if not api_key:
                    # GPT_API_KEY.json 파일 시도 (람다 패키지에 포함된 경우)
                    gpt_key_file = 'GPT_API_KEY.json'
                    if os.path.exists(gpt_key_file):
                        with open(gpt_key_file, 'r', encoding='utf-8') as f:
                            key_data = json.load(f)
                            api_key = key_data.get('key')
                
                if not api_key:
                    raise ValueError("GPT API key not found")
                
                client = OpenAI(api_key=api_key)
                
                # 사용자 입력 생성
                question = "사용자 정보\n" + user_info + "\n" + \
                          "쿼터별 데이터 분석 결과\n" + all_quarters_summary + "\n" + \
                          request_prompt
                
                print(f"  ✓ GPT 요청 준비 완료 (입력 길이: {len(question)} 자)")
                
                # GPT 모델 호출
                response = client.responses.create(
                    model="gpt-5",
                    input=question,
                    reasoning={"effort": "minimal"}
                )
                
                # GPT 응답 파싱
                answer = response.output_text
                print(f"  ✓ GPT 응답 수신 완료")
                
                # JSON 변환
                gpt_result = gpt.clean_and_convert_to_dict(answer)
                
                # 4) PlayerAi 테이블에 저장 (Django API 사용)
                try:
                    import requests
                    save_response = requests.post(
                        f"{django_api_url}/api/anal/save-player-ai/",
                        json={
                            'match_code': match_code,
                            'answer': gpt_result
                        },
                        timeout=API_TIMEOUT_SECONDS
                    )
                    
                    if save_response.status_code in [200, 201]:
                        print(f"  ✅ PlayerAi 저장 완료")
                        
                        # 5) PlayerMatch status를 'ai_done'으로 업데이트 (전체 완료)
                        try:
                            status_response = requests.patch(
                                f"{django_api_url}/api/anal/update-match-status/",
                                json={
                                    'match_code': match_code,
                                    'status': 'ai_done'
                                },
                                timeout=API_TIMEOUT_SECONDS
                            )
                            print(f"  ✅ Match status 'ai_done' 업데이트 완료 (전체 분석 완료)")
                            _create_analysis_completed_notification(
                                user_code=user_code,
                                match_code=match_code,
                                upload_code=upload_code,
                                metadata=metadata
                            )
                        except Exception as status_err:
                            print(f"  ⚠️ Match status 업데이트 실패: {status_err}")
                    else:
                        print(f"  ⚠️ PlayerAi 저장 실패: {save_response.status_code} - {save_response.text}")
                        raise Exception(f"PlayerAi 저장 실패: {save_response.text}")
                except Exception as save_err:
                    print(f"  ⚠️ PlayerAi 저장 API 호출 실패: {save_err}")
                    raise  # 에러를 상위로 전파하여 ai_fail 처리
            
            except Exception as gpt_err:
                print(f"  ⚠️ GPT 처리 중 오류: {gpt_err}")
                # PlayerMatch status를 'ai_fail'로 업데이트
                try:
                    import requests
                    fail_response = requests.patch(
                        f"{django_api_url}/api/anal/update-match-status/",
                        json={
                            'match_code': match_code,
                            'status': 'ai_fail',
                            'error_message': f"GPT 처리 실패: {str(gpt_err)}"
                        },
                        timeout=API_TIMEOUT_SECONDS
                    )
                    print(f"  ✓ Match status 'ai_fail' 업데이트: {fail_response.status_code}")
                except Exception as fail_err:
                    print(f"  ⚠️ Match status 업데이트 실패: {fail_err}")
            
            # 6) 임시 파일 정리
            import shutil
            try:
                shutil.rmtree(temp_dir)
                print(f"  ✓ 임시 파일 정리 완료")
            except:
                pass
            
            print("="*60)
            print("✅ GPT 처리 완료")
            print("="*60 + "\n")
        
        except Exception as gpt_process_err:
            print(f"⚠️ GPT 처리 건너뜀: {gpt_process_err}")
            # PlayerMatch status를 'ai_fail'로 업데이트
            try:
                import requests
                fail_response = requests.patch(
                    f"{django_api_url}/api/anal/update-match-status/",
                    json={
                        'match_code': match_code,
                        'status': 'ai_fail',
                        'error_message': f"GPT 초기화 실패: {str(gpt_process_err)}"
                    },
                    timeout=API_TIMEOUT_SECONDS
                )
                print(f"  ✓ Match status 'ai_fail' 업데이트: {fail_response.status_code}")
            except Exception as fail_err:
                print(f"  ⚠️ Match status 업데이트 실패: {fail_err}")
            traceback.print_exc()

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "analysis_completed",
                "match_code": match_code,
                "quarters": [
                    {
                        "quarter_name": q['quarter'],
                        "quarter_code": q['quarter_code'],
                        "status": q['status']
                    }
                    for q in quarters_for_analysis
                ],
                "ground_code": ground.get("ground_code"),
                "ground_name": ground.get("ground_name")
            })
        }
        
    except Exception as e:
        traceback.print_exc()
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}