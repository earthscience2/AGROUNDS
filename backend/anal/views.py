from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from DB.models import PlayerQuarter, PlayerAnal, PlayerMatchQuarterCross, PlayerMatch, PlayerMatchCross

# anal 앱은 분석 결과 관련 기능만 담당
# 경기 정보 추가는 match 앱에서 처리

def _get_quarter_anal_data(quarter_crosses):
    """쿼터 분석 데이터를 추출하는 헬퍼 함수"""
    quarter_data = []
    
    for quarter_cross in quarter_crosses:
        try:
            quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
            
            # 삭제된 쿼터는 제외
            if quarter.deleted_at is not None:
                continue
                
            anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)
            
            quarter_data.append({
                'total': anal_data.point_total or 0,
                'sprint': anal_data.point_sprint or 0,
                'acceleration': anal_data.point_acceleration or 0,
                'speed': anal_data.point_speed or 0,
                'positiveness': anal_data.point_positiveness or 0,
                'stamina': anal_data.point_stamina or 0,
                'distance': float(anal_data.T_D) if anal_data.T_D else 0.0,
                'max_speed': float(anal_data.T_HS) if anal_data.T_HS else 0.0,
                'sprint_count': int(anal_data.T_S) if anal_data.T_S else 0
            })
            
        except (PlayerQuarter.DoesNotExist, PlayerAnal.DoesNotExist):
            continue
    
    return quarter_data

def _calculate_match_max_values(quarter_data):
    """경기별 최대값을 계산하는 헬퍼 함수"""
    if not quarter_data:
        return {
            'max_total': 0,
            'max_sprint': 0,
            'max_acceleration': 0,
            'max_speed': 0,
            'max_positiveness': 0,
            'max_stamina': 0,
            'max_distance': 0.0,
            'max_sprint_count': 0
        }
    
    return {
        'max_total': max(item['total'] for item in quarter_data),
        'max_sprint': max(item['sprint'] for item in quarter_data),
        'max_acceleration': max(item['acceleration'] for item in quarter_data),
        'max_speed': max(item['speed'] for item in quarter_data),
        'max_positiveness': max(item['positiveness'] for item in quarter_data),
        'max_stamina': max(item['stamina'] for item in quarter_data),
        'max_distance': max(item['distance'] for item in quarter_data),
        'max_sprint_count': max(item['sprint_count'] for item in quarter_data)
    }

def _pad_list_to_five(data_list, default_value=0):
    """리스트를 5개로 패딩하는 헬퍼 함수"""
    while len(data_list) < 5:
        data_list.append(default_value)
    return data_list[:5]

def _extract_anal_data(anal_data, prefix=''):
    """분석 데이터를 추출하는 헬퍼 함수 - PlayerAnal 모델의 모든 컬럼 포함"""
    def safe_float(value):
        return float(value) if value is not None else 0
    
    def safe_int(value):
        return int(value) if value is not None else 0
    
    def safe_iso(value):
        return value.isoformat() if value is not None else None
    
    def safe_text(value):
        return str(value) if value is not None else ''
    
    return {
        # 기본 이동 데이터
        "distance": safe_float(getattr(anal_data, f'{prefix}D', None)),
        "time": safe_int(getattr(anal_data, f'{prefix}T', None)),
        "distance_per_minute": safe_float(getattr(anal_data, f'{prefix}DPM', None)),
        "time_percentage": safe_float(getattr(anal_data, f'{prefix}TPT', None)),
        
        # 속력 관련 데이터
        "average_speed": safe_float(getattr(anal_data, f'{prefix}AS', None)),
        "max_speed": safe_float(getattr(anal_data, f'{prefix}HS', None)),
        "max_speed_time": safe_iso(getattr(anal_data, f'{prefix}HS_T', None)),
        "q1_average_speed": safe_float(getattr(anal_data, f'{prefix}Q1_AS', None)),
        "q2_average_speed": safe_float(getattr(anal_data, f'{prefix}Q2_AS', None)),
        "speed_drop": safe_float(getattr(anal_data, f'{prefix}Drop_AS', None)),
        "top_10_speed": safe_float(getattr(anal_data, f'{prefix}HTS', None)),
        "bottom_10_speed": safe_float(getattr(anal_data, f'{prefix}LTS', None)),
        "speed_gap": safe_float(getattr(anal_data, f'{prefix}GS', None)),
        
        # 가속도 관련 데이터
        "average_acceleration": safe_float(getattr(anal_data, f'{prefix}AA', None)),
        "max_acceleration": safe_float(getattr(anal_data, f'{prefix}HA', None)),
        "max_acceleration_time": safe_iso(getattr(anal_data, f'{prefix}HA_T', None)),
        
        # 방향전환 관련 데이터
        "direction_change_90_150": safe_int(getattr(anal_data, f'{prefix}LDT', None)),
        "direction_change_150_180": safe_int(getattr(anal_data, f'{prefix}HDT', None)),
        
        # 활동 관련 데이터
        "movement_ratio": safe_float(getattr(anal_data, f'{prefix}MR', None)),
        
        # 스프린트 관련 데이터
        "sprint_count": safe_int(getattr(anal_data, f'{prefix}S', None)),
        "sprint_total_distance": safe_float(getattr(anal_data, f'{prefix}TSD', None)),
        "sprint_average_distance": safe_float(getattr(anal_data, f'{prefix}ASD', None)),
        "sprint_max_distance": safe_float(getattr(anal_data, f'{prefix}HSD', None)),
        "sprint_min_distance": safe_float(getattr(anal_data, f'{prefix}LSD', None)),
        "sprint_distance_percentage": safe_float(getattr(anal_data, f'{prefix}SDPD', None)),
        "sprint_average_speed": safe_float(getattr(anal_data, f'{prefix}ASS', None)),
        "sprint_max_speed": safe_float(getattr(anal_data, f'{prefix}HSS', None)),
        "sprint_average_acceleration": safe_float(getattr(anal_data, f'{prefix}ASA', None)),
        "sprint_max_acceleration": safe_float(getattr(anal_data, f'{prefix}HSA', None)),
        
        # 리스트 데이터 (텍스트 필드)
        "average_speed_list": safe_text(getattr(anal_data, f'{prefix}AS_L', None)),
        "average_acceleration_list": safe_text(getattr(anal_data, f'{prefix}AA_L', None)),
        "sprint_list": safe_text(getattr(anal_data, f'{prefix}S_L', None)),
        "direction_change_90_150_list": safe_text(getattr(anal_data, f'{prefix}LDT_L', None)),
        "direction_change_150_180_list": safe_text(getattr(anal_data, f'{prefix}HDT_L', None)),
        
        # 원본 필드명으로도 접근 가능하도록 추가
        "T_D": safe_float(getattr(anal_data, f'{prefix}D', None)) if prefix == 'T_' else None,
        "T_T": safe_int(getattr(anal_data, f'{prefix}T', None)) if prefix == 'T_' else None,
        "T_DPM": safe_float(getattr(anal_data, f'{prefix}DPM', None)) if prefix == 'T_' else None,
        "T_AS": safe_float(getattr(anal_data, f'{prefix}AS', None)) if prefix == 'T_' else None,
        "T_HS": safe_float(getattr(anal_data, f'{prefix}HS', None)) if prefix == 'T_' else None,
        "T_HS_T": safe_iso(getattr(anal_data, f'{prefix}HS_T', None)) if prefix == 'T_' else None,
        "T_Q1_AS": safe_float(getattr(anal_data, f'{prefix}Q1_AS', None)) if prefix == 'T_' else None,
        "T_Q2_AS": safe_float(getattr(anal_data, f'{prefix}Q2_AS', None)) if prefix == 'T_' else None,
        "T_Drop_AS": safe_float(getattr(anal_data, f'{prefix}Drop_AS', None)) if prefix == 'T_' else None,
        "T_HTS": safe_float(getattr(anal_data, f'{prefix}HTS', None)) if prefix == 'T_' else None,
        "T_LTS": safe_float(getattr(anal_data, f'{prefix}LTS', None)) if prefix == 'T_' else None,
        "T_GS": safe_float(getattr(anal_data, f'{prefix}GS', None)) if prefix == 'T_' else None,
        "T_AA": safe_float(getattr(anal_data, f'{prefix}AA', None)) if prefix == 'T_' else None,
        "T_HA": safe_float(getattr(anal_data, f'{prefix}HA', None)) if prefix == 'T_' else None,
        "T_HA_T": safe_iso(getattr(anal_data, f'{prefix}HA_T', None)) if prefix == 'T_' else None,
        "T_LDT": safe_int(getattr(anal_data, f'{prefix}LDT', None)) if prefix == 'T_' else None,
        "T_HDT": safe_int(getattr(anal_data, f'{prefix}HDT', None)) if prefix == 'T_' else None,
        "T_MR": safe_float(getattr(anal_data, f'{prefix}MR', None)) if prefix == 'T_' else None,
        "T_S": safe_int(getattr(anal_data, f'{prefix}S', None)) if prefix == 'T_' else None,
        "T_TSD": safe_float(getattr(anal_data, f'{prefix}TSD', None)) if prefix == 'T_' else None,
        "T_ASD": safe_float(getattr(anal_data, f'{prefix}ASD', None)) if prefix == 'T_' else None,
        "T_HSD": safe_float(getattr(anal_data, f'{prefix}HSD', None)) if prefix == 'T_' else None,
        "T_LSD": safe_float(getattr(anal_data, f'{prefix}LSD', None)) if prefix == 'T_' else None,
        "T_SDPD": safe_float(getattr(anal_data, f'{prefix}SDPD', None)) if prefix == 'T_' else None,
        "T_ASS": safe_float(getattr(anal_data, f'{prefix}ASS', None)) if prefix == 'T_' else None,
        "T_HSS": safe_float(getattr(anal_data, f'{prefix}HSS', None)) if prefix == 'T_' else None,
        "T_ASA": safe_float(getattr(anal_data, f'{prefix}ASA', None)) if prefix == 'T_' else None,
        "T_HSA": safe_float(getattr(anal_data, f'{prefix}HSA', None)) if prefix == 'T_' else None,
        "T_AS_L": safe_text(getattr(anal_data, f'{prefix}AS_L', None)) if prefix == 'T_' else None,
        "T_AA_L": safe_text(getattr(anal_data, f'{prefix}AA_L', None)) if prefix == 'T_' else None,
        "T_S_L": safe_text(getattr(anal_data, f'{prefix}S_L', None)) if prefix == 'T_' else None,
        "T_LDT_L": safe_text(getattr(anal_data, f'{prefix}LDT_L', None)) if prefix == 'T_' else None,
        "T_HDT_L": safe_text(getattr(anal_data, f'{prefix}HDT_L', None)) if prefix == 'T_' else None,
    }


# 최근 5경기 OVR 데이터 조회
class Get_UserOvr_last_5_matches_From_Player(APIView):
    """
    사용자 OVR 데이터 조회 (실제 데이터 파싱)
    """
    def get(self, request):
        user_code = request.query_params.get('user_code')
        
        if not user_code:
            return Response({"error": "user_code parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 플레이어 매치 데이터 조회 (최근 5경기, PlayerMatch.start_time 기준)
            player_match_codes_qs = PlayerMatchCross.objects.filter(user_code=user_code).values_list('match_code', flat=True).distinct()
            match_codes = list(player_match_codes_qs)
            player_matches = list(PlayerMatch.objects.filter(match_code__in=match_codes).order_by('-start_time')[:5])
            matches_count = len(player_matches)
            
            if matches_count == 0:
                return Response({
                    "ovr": 0,
                    "matches_count": 0,
                    "message": "분석 후 지표 확인가능해요"
                })
            
            # 경기별 최고 쿼터 점수 추적 (최근 5경기)
            match_max_totals = []
            match_max_sprints = []
            match_max_accelerations = []
            match_max_speeds = []
            match_max_positivenesses = []
            match_max_staminas = []
            
            for match in player_matches:
                try:
                    # 해당 매치의 모든 쿼터 조회
                    quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match.match_code, deleted_at__isnull=True)
                    
                    # 쿼터 분석 데이터 추출
                    quarter_data = _get_quarter_anal_data(quarter_crosses)
                    max_values = _calculate_match_max_values(quarter_data)
                    
                    # 각 경기의 최고 쿼터 점수들을 리스트에 추가
                    match_max_totals.append(max_values['max_total'])
                    match_max_sprints.append(max_values['max_sprint'])
                    match_max_accelerations.append(max_values['max_acceleration'])
                    match_max_speeds.append(max_values['max_speed'])
                    match_max_positivenesses.append(max_values['max_positiveness'])
                    match_max_staminas.append(max_values['max_stamina'])
                            
                except Exception:
                    # 경기 데이터 오류시 0으로 추가
                    match_max_totals.append(0)
                    match_max_sprints.append(0)
                    match_max_accelerations.append(0)
                    match_max_speeds.append(0)
                    match_max_positivenesses.append(0)
                    match_max_staminas.append(0)
            
            # 디버그용 전체 쿼터 데이터 수집 (미니차트 루프에서 수집됨)
            all_quarter_totals = []
            all_quarter_sprints = []

            # 6가지 지표 평균 계산 (각 경기의 최고 쿼터 점수들의 평균)
            if match_max_totals:
                # OVR (total) 계산 - 각 경기 최고 쿼터 점수들의 평균
                ovr = sum(match_max_totals) / len(match_max_totals)
                ovr = int(round(ovr))  # 정수로 변환
                
                # 나머지 5가지 지표 계산 - 각 경기 최고 쿼터 점수들의 평균
                avg_sprint = int(round(sum(match_max_sprints) / len(match_max_sprints))) if match_max_sprints else 0
                avg_acceleration = int(round(sum(match_max_accelerations) / len(match_max_accelerations))) if match_max_accelerations else 0
                avg_speed = int(round(sum(match_max_speeds) / len(match_max_speeds))) if match_max_speeds else 0
                avg_positiveness = int(round(sum(match_max_positivenesses) / len(match_max_positivenesses))) if match_max_positivenesses else 0
                avg_stamina = int(round(sum(match_max_staminas) / len(match_max_staminas))) if match_max_staminas else 0
                
                
            else:
                # 데이터가 없는 경우 모든 지표 0으로 설정
                ovr = 0
                avg_sprint = 0
                avg_acceleration = 0
                avg_speed = 0
                avg_positiveness = 0
                avg_stamina = 0
            
            # 각 경기의 쿼터 중 최대값으로 미니 차트 데이터 구성
            match_max_point_totals = []
            match_max_distances = []
            match_max_speeds = []
            match_max_sprints = []
            match_dates = []
            
            for match in player_matches:
                try:
                    quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match.match_code, deleted_at__isnull=True)
                    quarter_data = _get_quarter_anal_data(quarter_crosses)
                    max_values = _calculate_match_max_values(quarter_data)
                    
                    # 디버그용 전체 쿼터 데이터 수집
                    for data in quarter_data:
                        all_quarter_totals.append(data['total'])
                        all_quarter_sprints.append(data['sprint'])
                    
                    match_max_point_totals.append(max_values['max_total'])
                    match_max_distances.append(round(max_values['max_distance'], 2))
                    match_max_speeds.append(round(max_values['max_speed']))
                    match_max_sprints.append(max_values['max_sprint_count'])
                    
                    # 날짜 정보 추가
                    if match.start_time:
                        match_dates.append(match.start_time.isoformat())
                    else:
                        match_dates.append(None)
                        
                except Exception:
                    match_max_point_totals.append(0)
                    match_max_distances.append(0)
                    match_max_speeds.append(0)
                    match_max_sprints.append(0)
                    match_dates.append(None)

            # 길이를 5로 보정 (부족하면 0 패딩)
            match_max_point_totals = _pad_list_to_five(match_max_point_totals, 0)
            match_max_distances = _pad_list_to_five(match_max_distances, 0)
            match_max_speeds = _pad_list_to_five(match_max_speeds, 0)
            match_max_sprints = _pad_list_to_five(match_max_sprints, 0)
            match_dates = _pad_list_to_five(match_dates, None)

            # 최신 경기가 마지막에 오도록 순서 뒤집기 (그래프 및 현재값 표시 일관성)
            match_max_point_totals = list(reversed(match_max_point_totals[:5]))
            match_max_distances = list(reversed(match_max_distances[:5]))
            match_max_speeds = list(reversed(match_max_speeds[:5]))
            match_max_sprints = list(reversed(match_max_sprints[:5]))
            match_dates = list(reversed(match_dates[:5]))
            

            return Response({
                # 기본 정보
                "ovr": ovr,
                "matches_count": matches_count,
                "quarter_count": len(all_quarter_totals),
                "message": f"최근 {matches_count}경기 평균 점수" if matches_count > 0 else "분석 후 지표 확인가능해요",
                
                # 6가지 지표 데이터
                "point": {
                    "total": ovr,
                    "sprint": avg_sprint,
                    "acceleration": avg_acceleration,
                    "speed": avg_speed,
                    "positiveness": avg_positiveness,
                    "stamina": avg_stamina
                },
                
                # 레이더 차트용 데이터 (동일한 값)
                "radar_data": {
                    "point_total": ovr,
                    "point_sprint": avg_sprint,
                    "point_acceleration": avg_acceleration,
                    "point_speed": avg_speed,
                    "point_positiveness": avg_positiveness,
                    "point_stamina": avg_stamina
                },
                
                # 하단 미니 차트 데이터 (각 경기의 쿼터 최대값 기반)
                "mini_chart_data": {
                    "point_total": match_max_point_totals,
                    "distance": match_max_distances,
                    "max_speed": match_max_speeds,
                    "sprint": match_max_sprints,
                    "dates": match_dates
                },
                
                # 디버그 정보
                "debug_info": {
                    "quarter_data_count": len(all_quarter_totals),
                    "raw_totals": all_quarter_totals[:10] if len(all_quarter_totals) > 10 else all_quarter_totals,  # 최대 10개만 표시
                    "raw_sprints": all_quarter_sprints[:10] if len(all_quarter_sprints) > 10 else all_quarter_sprints
                }
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 최근 5경기 통계 데이터 조회
class Get_UserPoint_last_5_matches_From_Player(APIView):
    """
    사용자 통계 데이터 조회 (현재는 기본값만 반환)
    """
    def get(self, request):
        user_code = request.query_params.get('user_code')
        
        if not user_code:
            return Response({"error": "user_code parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 플레이어 매치 데이터 조회
            matches_count = PlayerMatchCross.objects.filter(user_code=user_code).count()
            
            # 통계 데이터 생성 (실제 데이터가 없으면 0)
            stats_data = {
                "total": 0,
                "sprint": 0,
                "acceleration": 0,
                "speed": 0,
                "positiveness": 0,
                "stamina": 0,
                "matches_count": matches_count
            }
            
            return Response(stats_data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 쿼터 분석 데이터 조회
class Get_QuarterData_From_Player(APIView):
    """
    쿼터 코드로 쿼터 분석 전체 데이터 조회 (PlayerAnal 모델 기반)
    """
    def get(self, request):
        user_code = request.query_params.get('user_code')
        quarter_code = request.query_params.get('quarter_code')
        
        if not all([user_code, quarter_code]):
            return Response({
                "error": "user_code and quarter_code parameters are required."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            
            # 쿼터 정보 조회
            try:
                quarter = PlayerQuarter.objects.get(quarter_code=quarter_code)
            except PlayerQuarter.DoesNotExist:
                return Response({
                    "error": "Quarter not found."
                }, status=status.HTTP_404_NOT_FOUND)
            
            if quarter.deleted_at is not None:
                return Response({
                    "error": "Quarter has been deleted."
                }, status=status.HTTP_404_NOT_FOUND)
            
            # 분석 데이터 조회
            try:
                anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)
            except PlayerAnal.DoesNotExist:
                return Response({
                    "error": "Analysis data not found for this quarter."
                }, status=status.HTTP_404_NOT_FOUND)
            
            # 경기 정보 조회
            match_cross = PlayerMatchQuarterCross.objects.filter(quarter_code=quarter_code).first()
            match_info = None
            if match_cross:
                match_info = PlayerMatch.objects.filter(match_code=match_cross.match_code).first()
            
            # 쿼터 기본 정보
            quarter_info = {
                "quarter_code": quarter.quarter_code,
                "name": quarter.name,
                "start_time": quarter.start_time.isoformat() if quarter.start_time else None,
                "end_time": quarter.end_time.isoformat() if quarter.end_time else None,
                "duration": (quarter.end_time - quarter.start_time).total_seconds() / 60 if quarter.start_time and quarter.end_time else None,
                "status": getattr(quarter, 'status', 'normal'),
                "home": getattr(quarter, 'home', 'west')
            }
            
            # 경기 정보
            match_info_data = None
            if match_info:
                match_info_data = {
                    "match_code": match_info.match_code,
                    "name": match_info.name,
                    "start_time": match_info.start_time.isoformat() if match_info.start_time else None,
                    "end_time": match_info.end_time.isoformat() if match_info.end_time else None,
                    "standard": getattr(match_info, 'standard', 'north'),
                    "home": getattr(match_info, 'home', 'west')
                }
            
            # Total 분석 데이터 (전체 쿼터)
            total_data = _extract_anal_data(anal_data, 'T_')
            total_data.update({
                "heatmap_data": anal_data.T_HMAP if anal_data.T_HMAP else None,
                "sprint_map_data": anal_data.T_SMAP if anal_data.T_SMAP else None,
                "direction_map_data": anal_data.T_DMAP if anal_data.T_DMAP else None
            })
            
            # Attack 분석 데이터 (공격 상황)
            attack_data = _extract_anal_data(anal_data, 'A_')
            
            # Defense 분석 데이터 (수비 상황)
            defense_data = _extract_anal_data(anal_data, 'D_')
            
            # 포인트 데이터
            point_data = {
                "total": int(anal_data.point_total or 0),
                "attack": int(anal_data.point_attack or 0),
                "defense": int(anal_data.point_defense or 0),
                "stamina": int(anal_data.point_stamina or 0),
                "positiveness": int(anal_data.point_positiveness or 0),
                "speed": int(anal_data.point_speed or 0),
                "acceleration": int(anal_data.point_acceleration or 0),
                "sprint": int(anal_data.point_sprint or 0)
            }
            
            # 노이즈 데이터
            noise_data = {
                "time_noise": float(anal_data.noise_time or 0),
                "gps_noise": float(anal_data.noise_gps or 0),
                "reliability": float(anal_data.noise_reliability or 0)
            }
            
            
            return Response({
                "quarter_info": quarter_info,
                "match_info": match_info_data,
                "total_data": total_data,
                "attack_data": attack_data,
                "defense_data": defense_data,
                "point_data": point_data,
                "noise_data": noise_data,
                "created_at": anal_data.created_at.isoformat() if anal_data.created_at else None
            })
            
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)