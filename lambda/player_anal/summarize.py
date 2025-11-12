import json
import time
from pathlib import Path


def _fmt_float(val, nd=1):
    try:
        f = float(val)
        # 정수면 소수점 제거
        if abs(f - round(f)) < 1e-9:
            return str(int(round(f)))
        return f"{f:.{nd}f}"
    except Exception:
        return "-"


def summarize_quarter_compact(result: dict) -> str:
    """
    분석 JSON(쿼터 단위)에서 핵심만 뽑아 토큰 절약형 요약 텍스트 생성.
    - 리스트/좌표 등 대용량 필드는 배제
    - 값은 필요한 만큼만 반올림
    출력은 한국어, 짧은 문장 위주
    """
    # 메타
    quarter = result.get("quarter_name", "-")
    status = result.get("status", "-")
    std = result.get("standard")
    home = result.get("home")

    # 휴식 쿼터인 경우 분석 값 반환하지 않음
    if home == "rest":
        meta = []
        if quarter:
            meta.append(f"{quarter}")
        if status:
            meta.append(f"상태 {status}")
        if std:
            meta.append(f"방향 {std}/휴식")
        if meta:
            return " | ".join(meta) + "\n휴식 쿼터 - 분석 데이터 없음"
        return "휴식 쿼터 - 분석 데이터 없음"

    total = result.get("total", {}) or {}
    attack = result.get("attack", {}) or {}
    defense = result.get("defense", {}) or {}
    point = result.get("point", {}) or {}

    minutes = total.get("T_T")

    # 핵심 지표 (TOTAL)
    td_km = _fmt_float(total.get("T_D"), 2)
    dpm = _fmt_float(total.get("T_DPM"), 1)
    as_avg = _fmt_float(total.get("T_AS"), 1)
    hs = _fmt_float(total.get("T_HS"), 1)
    hs_t = total.get("T_HS_T") or "-"
    aa = _fmt_float(total.get("T_AA"), 2)
    ha = _fmt_float(total.get("T_HA"), 2)
    ldt = str(int(total.get("T_LDT", 0)))
    hdt = str(int(total.get("T_HDT", 0)))
    mr = _fmt_float(total.get("T_MR"), 1)

    s_cnt = str(int(total.get("T_S", 0)))
    tsd = _fmt_float(total.get("T_TSD"), 1)
    asd = _fmt_float(total.get("T_ASD"), 1)
    hsd = _fmt_float(total.get("T_HSD"), 1)
    ass = _fmt_float(total.get("T_ASS"), 1)

    # 공격/수비 요약
    a_tpt = _fmt_float(attack.get("A_TPT"), 1)
    a_mr = _fmt_float(attack.get("A_MR"), 1)
    d_tpt = _fmt_float(defense.get("D_TPT"), 1)
    d_mr = _fmt_float(defense.get("D_MR"), 1)

    # 포인트
    p_total = str(int(point.get("total", 0)))
    p_attack = str(int(point.get("attack", 0)))
    p_defense = str(int(point.get("defense", 0)))
    p_stamina = str(int(point.get("stamina", 0)))
    p_posi = str(int(point.get("positiveness", 0)))
    p_speed = str(int(point.get("speed", 0)))
    p_acc = str(int(point.get("acceleration", 0)))
    p_sprint = str(int(point.get("sprint", 0)))

    lines = []
    # 1) 메타
    meta = []
    if quarter:
        meta.append(f"{quarter}")
    if status:
        meta.append(f"상태 {status}")
    if minutes is not None:
        meta.append(f"출전 {int(minutes)}분")
    if std and home:
        meta.append(f"방향 {std}/{home}")
    if meta:
        lines.append(" | ".join(meta))

    # 2) 이동/속력/가속 요약
    lines.append(
        f"이동 {td_km}km ({dpm} m/min) | 속력 평균 {as_avg}, 최고 {hs} ({hs_t}) | 가속 평균 {aa}, 최고 {ha}"
    )

    # 3) 방향전환/활동면적
    lines.append(
        f"방향전환 LDT {ldt}, HDT {hdt} | 활동면적 {mr}%"
    )

    # 4) 스프린트 요약
    lines.append(
        f"스프린트 {s_cnt}회 | 총 {tsd}m, 평균 {asd}m, 최고 {hsd}m | 평균속력 {ass}km/h"
    )

    # 5) 공격/수비 분포
    lines.append(
        f"공격 TPT {a_tpt}%, MR {a_mr}% | 수비 TPT {d_tpt}%, MR {d_mr}%"
    )

    # 6) 포인트 요약
    lines.append(
        f"포인트 총 {p_total} | 공{p_attack} 수{p_defense} 스태{p_stamina} 적{p_posi} 속{p_speed} 가속{p_acc} 스프{p_sprint}"
    )

    return "\n".join(lines)


def _strip_b64(obj):
    """딥 복사 없이 순회하며 b64 페이로드만 제거한 새 객체 반환."""
    if isinstance(obj, dict):
        new_d = {}
        for k, v in obj.items():
            if k == "b64":
                new_d[k] = "<omitted>"
            else:
                new_d[k] = _strip_b64(v)
        return new_d
    if isinstance(obj, list):
        return [_strip_b64(x) for x in obj]
    return obj


def summarize_quarter_full(result: dict) -> str:
    """
    전체 정보를 텍스트(JSON)로 그대로 제공하되, 대용량 b64 페이로드는 생략.
    """
    safe = _strip_b64(result)
    return json.dumps(safe, ensure_ascii=False, indent=2)


# 키 → 설명/단위 매핑(핵심 위주)
FIELD_INFO = {
    # meta
    "quarter_name": ("쿼터", None, "쿼터명"),
    "status": ("상태", None, "출전 여부"),
    "standard": ("기준 방향", None, "north/south"),
    "home": ("홈 방향", None, "east/west"),
    # total/attack/defense 공통 접두사 T_/A_/D_
    "_D": ("이동거리", "km", "총 이동거리"),
    "_T": ("이동시간", "분", "출전 시간"),
    "_DPM": ("분당 이동거리", "m/min", "이동 효율"),
    "_AS": ("평균속력", "km/h", "평균 속도"),
    "_HS": ("최고속력", "km/h", "최대 속도"),
    "_HS_T": ("최고속력 시각", None, "최고속력 발생 시간"),
    "_Q1_AS": ("전반 평균속력", "km/h", "전반부 평균"),
    "_Q2_AS": ("후반 평균속력", "km/h", "후반부 평균"),
    "_Drop_AS": ("속도 저하율", "%", "전반→후반 감소율"),
    "_HTS": ("상위 30% 속력", "km/h", None),
    "_LTS": ("하위 30% 속력", "km/h", None),
    "_GS": ("상·하위 속력 차", "km/h", None),
    "_AA": ("평균가속도", "m/s^2", None),
    "_HA": ("최고가속도", "m/s^2", None),
    "_HA_T": ("최고가속 시각", None, None),
    "_LDT": ("90–150° 전환", "회", None),
    "_HDT": ("150–180° 전환", "회", None),
    "_MR": ("활동 면적", "%", None),
    "_S": ("스프린트 횟수", "회", None),
    "_TSD": ("스프린트 총거리", "m", None),
    "_ASD": ("스프린트 평균거리", "m", None),
    "_HSD": ("스프린트 최장거리", "m", None),
    "_LSD": ("스프린트 최소거리", "m", None),
    "_SDPD": ("총 이동 대비 스프린트", "%", None),
    "_ASS": ("스프린트 평균속력", "km/h", None),
    "_HSS": ("스프린트 최고속력", "km/h", None),
    "_ASA": ("스프린트 평균가속도", "m/s^2", None),
    "_HSA": ("스프린트 최고가속도", "m/s^2", None),
    # attack/defense 특화
    "A_TPT": ("공격 체류비율", "%", "전체 대비 공격 구역 체류"),
    "D_TPT": ("수비 체류비율", "%", "전체 대비 수비 구역 체류"),
}


def _label_for(key: str):
    if key in FIELD_INFO:
        return FIELD_INFO[key]
    # 접두사형 키(T_/A_/D_) 처리
    if len(key) >= 3 and key[1] == '_' and key[:2] in ("T_", "A_", "D_"):
        suffix = key[2:]
        if f"_{suffix}" in FIELD_INFO:
            name, unit, desc = FIELD_INFO[f"_{suffix}"]
            section = {"T": "전체", "A": "공격", "D": "수비"}[key[0]]
            return (f"{section} {name}", unit, desc)
    return (key, None, None)


def summarize_quarter_readable(result: dict) -> str:
    """사람과 AI가 바로 이해하기 쉽게: 라벨/단위 포함 풀리드 형식.
    - 수치 리스트나 이벤트 리스트는 길이만 표기
    - 맵 객체는 grid 정보와 레이어 이름만 표기(b64 생략)
    """
    # 휴식 쿼터인 경우 분석 값 반환하지 않음
    home = result.get("home")
    if home == "rest":
        meta_keys = ["quarter_name", "status", "standard", "home", "start", "end", "ground_name"]
        meta = []
        for k in meta_keys:
            if k in result:
                value = result.get(k)
                if k == "home" and value == "rest":
                    meta.append(f"{_label_for(k)[0]}: 휴식")
                else:
                    meta.append(f"{_label_for(k)[0]}: {value}")
        if meta:
            return "[메타] " + " | ".join(meta) + "\n휴식 쿼터 - 분석 데이터 없음"
        return "휴식 쿼터 - 분석 데이터 없음"

    def fmt_val(k: str, v):
        # 리스트는 길이만
        if isinstance(v, list):
            return f"[{len(v)}개]"
        # 수치형 포매팅
        try:
            fv = float(v)
            # 자릿수: 정수/소수1/소수2 자동
            if abs(fv - round(fv)) < 1e-9:
                return str(int(round(fv)))
            return f"{fv:.2f}" if abs(fv) < 10 else f"{fv:.1f}"
        except Exception:
            return str(v)

    lines: list[str] = []
    # 메타
    meta_keys = ["quarter_name", "status", "standard", "home", "start", "end", "ground_name"]
    meta = []
    for k in meta_keys:
        if k in result:
            value = result.get(k)
            if k == "home" and value == "rest":
                meta.append(f"{_label_for(k)[0]}: 휴식")
            else:
                meta.append(f"{_label_for(k)[0]}: {value}")
    if meta:
        lines.append("[메타] " + " | ".join(meta))

    # 섹션 출력 (T_, A_, D_ 접두사 키들을 섹션별로 그룹화)
    for prefix, title in (("T", "전체"), ("A", "공격"), ("D", "수비")):
        # 해당 접두사를 가진 키들 찾기
        sect_keys = [k for k in result.keys() if k.startswith(f"{prefix}_")]
        if not sect_keys:
            continue
            
        lines.append(f"[{title}]")
        # 키 정렬: 알파벳이 아닌 가독 우선 순서
        prefer = (
            "D", "T", "DPM", "AS", "HS", "HS_T", "Q1_AS", "Q2_AS", "Drop_AS",
            "AA", "HA", "HA_T", "LDT", "HDT", "MR", "S", "TSD", "ASD", "HSD",
            "LSD", "SDPD", "ASS", "HSS", "ASA", "HSA", "TPT"
        )
        def sort_key(k):
            if len(k) >= 3 and k[1] == '_':
                suf = k[2:]
                try:
                    return prefer.index(suf)
                except ValueError:
                    return 999
            return 999
        
        for k in sorted(sect_keys, key=sort_key):
            v = result[k]
            name, unit, _ = _label_for(k)
            # 대용량 또는 필요 없는 상세 제거: *_L 리스트, *MAP 맵 요약 출력 안 함
            if k.endswith("_L") or k.endswith("MAP"):
                continue
            else:
                fv = fmt_val(k, v)
                lines.append(f"- {name}: {fv}{(' '+unit) if unit else ''}")

    # 포인트 (point_ 접두사로 저장된 데이터 읽기)
    point_keys = [k for k in result.keys() if k.startswith("point_")]
    if point_keys:  # 포인트 데이터가 있을 때만 섹션 출력
        lines.append("[포인트]")
        order = ("total", "attack", "defense", "stamina", "positiveness", "speed", "acceleration", "sprint")
        for k in order:
            point_key = f"point_{k}"
            if point_key in result:
                lines.append(f"- {k}: {result[point_key]}")
    return "\n".join(lines)


def summarize_file(json_path: str) -> str:
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    # 단일 모드: 라벨/단위 포함 가독성 출력
    text = summarize_quarter_readable(data)
    return text


def summarize_all_quarters(base_name: str, result_dir: str = "result/anal") -> str:
    """
    기본 이름을 받아서 해당하는 모든 쿼터 파일들을 찾아 요약
    예: base_name이 "015_2506281250_edit"이면 
    "015_2506281250_edit_1쿼터_result.json", "015_2506281250_edit_2쿼터_result.json" 등을 찾음
    """
    from pathlib import Path
    
    result_path = Path(result_dir)
    if not result_path.exists():
        return f"결과 디렉토리를 찾을 수 없습니다: {result_dir}"
    
    # 쿼터 파일들 찾기
    quarter_files = []
    quarters = ["1쿼터", "2쿼터", "3쿼터", "4쿼터"]
    
    for quarter in quarters:
        file_pattern = f"{base_name}_{quarter}_result.json"
        file_path = result_path / file_pattern
        if file_path.exists():
            quarter_files.append((quarter, str(file_path)))
    
    if not quarter_files:
        return f"'{base_name}'에 해당하는 쿼터 파일들을 찾을 수 없습니다."
    
    # 각 쿼터별 요약 생성
    summaries = []
    summaries.append(f"=== {base_name} 전체 쿼터 요약 ===\n")
    
    for quarter, file_path in quarter_files:
        try:
            quarter_summary = summarize_file(file_path)
            summaries.append(f"[{quarter}]")
            summaries.append(quarter_summary)
            summaries.append("")  # 빈 줄 추가
        except Exception as e:
            summaries.append(f"[{quarter}] 오류: {str(e)}")
            summaries.append("")
    
    return "\n".join(summaries)


if __name__ == "__main__":
    # 입력 경로를 파일/CLI/대화상자로 지정 가능
    import sys
    from pathlib import Path as _P
    _t0 = time.time()

    inp = "015_2506220645_10"  # 기본값을 기본 이름으로 변경

    # 1) 설정 파일: summarize_input.txt (1행=input_json, 2행=model?)
    try:
        cfg = _P(__file__).with_name("summarize_input.txt")
        if cfg.exists():
            lines = [ln.strip() for ln in cfg.read_text(encoding="utf-8").splitlines() if ln.strip()]
            if len(lines) >= 1:
                inp = lines[0]
    except Exception:
        pass

    # 2) CLI: <input_json>
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) >= 1:
        inp = args[0]

    # 3) 파일 선택 대화상자 (설정/CLI 없으면)
    if not inp:
        try:
            import tkinter as tk
            from tkinter import filedialog
            root = tk.Tk(); root.withdraw()
            sel = filedialog.askopenfilename(title="요약할 JSON 파일 선택", filetypes=(("JSON Files","*.json"), ("All Files","*.*")))
            if sel:
                inp = sel
        except Exception:
            pass

    if not inp:
        print("usage: python summarize.py <input_name_or_json_path> [--model <name>]\n예시: python summarize.py 015_2506281250_edit\n또는 summarize_input.txt 파일을 사용하거나 파일 선택 창에서 선택하세요.")
        sys.exit(1)
    
    # 입력이 .json으로 끝나면 단일 파일, 아니면 기본 이름으로 판단
    if inp.endswith('.json') and _P(inp).exists():
        # 단일 파일 모드
        summary_text = summarize_file(inp)
    else:
        # 기본 이름 모드 - 모든 쿼터 요약
        summary_text = summarize_all_quarters(inp)
    
    print(summary_text)

    # 토큰 수 출력 (tiktoken 활용). --model <name> 옵션으로 인코딩 선택 가능
    def _count_tokens(text: str, model: str = None):
        try:
            import tiktoken  # type: ignore
            if model:
                try:
                    enc = tiktoken.encoding_for_model(model)
                    enc_name = enc.name
                except Exception:
                    enc = tiktoken.get_encoding("cl100k_base")
                    enc_name = "cl100k_base"
            else:
                enc = tiktoken.get_encoding("cl100k_base")
                enc_name = "cl100k_base"
            return len(enc.encode(text)), enc_name
        except Exception:
            # 근사치: 공백 기준 토큰 ~ 단어수*1.3 추정
            approx = int(len(text.split()) * 1.3)
            return approx, "approx"

    # --model 인자 / 설정파일 3행
    model_arg = None
    try:
        cfg = _P(__file__).with_name("summarize_input.txt")
        if cfg.exists():
            lines = [ln.strip() for ln in cfg.read_text(encoding="utf-8").splitlines() if ln.strip()]
            if len(lines) >= 3:
                model_arg = lines[2]
    except Exception:
        pass
    if "--model" in sys.argv:
        try:
            idx = sys.argv.index("--model")
            model_arg = sys.argv[idx + 1]
        except Exception:
            pass

    n_tokens, enc_name = _count_tokens(summary_text, model=model_arg)
    print(f"[tokens:{enc_name}] {n_tokens}")
    print(f"⏱ summarize 실행 시간: {time.time() - _t0:.2f}초")


