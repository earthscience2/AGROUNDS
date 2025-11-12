from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from DB.models import (
    PlayerQuarter, PlayerAnal, PlayerMatchQuarterCross, 
    PlayerMatch, PlayerMatchCross, Upload, GroundInfo, User,
    PlayerAi, Notification
)
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import uuid
import json
import requests
from django.conf import settings
try:
    from requests_aws4auth import AWS4Auth
    HAS_AWS4AUTH = True
except ImportError:
    HAS_AWS4AUTH = False
    print("Warning: requests-aws4auth not installed. AWS IAM authentication will not work.")

# ===============================================
# 헬퍼 함수
# ===============================================

def _get_quarter_anal_data(quarter_crosses):
    """쿼터 분석 데이터를 추출하는 헬퍼 함수"""
    quarter_data = []
    
    for quarter_cross in quarter_crosses:
        try:
            quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
            
            # 삭제된 쿼터는 제외 (deleted_at 필드가 있는 경우에만 체크)
            if hasattr(quarter, 'deleted_at') and quarter.deleted_at is not None:
                continue
                
            anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)
            
            quarter_data.append({
                'total': anal_data.point_total or 0,
                'attack': anal_data.point_attack or 0,
                'defense': anal_data.point_defense or 0,
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
            'max_attack': 0,
            'max_defense': 0,
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
        'max_attack': max(item['attack'] for item in quarter_data),
        'max_defense': max(item['defense'] for item in quarter_data),
        'max_sprint': max(item['sprint'] for item in quarter_data),
        'max_acceleration': max(item['acceleration'] for item in quarter_data),
        'max_speed': max(item['max_speed'] for item in quarter_data),  # 실제 최고속력 사용
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
        if value is None:
            return 0
        try:
            return float(value)
        except (ValueError, TypeError):
            return 0
    
    def safe_int(value):
        if value is None:
            return 0
        try:
            return int(value)
        except (ValueError, TypeError):
            return 0
    
    def safe_iso(value):
        if value is None:
            return None
        try:
            if hasattr(value, 'isoformat'):
                return value.isoformat()
            return None
        except (AttributeError, TypeError):
            return None
    
    def safe_json(value):
        """JSONField 값을 안전하게 처리"""
        if value is None:
            return None
        # JSONField는 이미 Python 객체(dict/list)이므로 그대로 반환
        return value
    
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
        
        # 리스트 데이터 (JSON 필드)
        "average_speed_list": safe_json(getattr(anal_data, f'{prefix}AS_L', None)),
        "average_acceleration_list": safe_json(getattr(anal_data, f'{prefix}AA_L', None)),
        "sprint_list": safe_json(getattr(anal_data, f'{prefix}S_L', None)),
        "direction_change_90_150_list": safe_json(getattr(anal_data, f'{prefix}LDT_L', None)),
        "direction_change_150_180_list": safe_json(getattr(anal_data, f'{prefix}HDT_L', None)),
        
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
        "T_AS_L": safe_json(getattr(anal_data, f'{prefix}AS_L', None)) if prefix == 'T_' else None,
        "T_AA_L": safe_json(getattr(anal_data, f'{prefix}AA_L', None)) if prefix == 'T_' else None,
        "T_S_L": safe_json(getattr(anal_data, f'{prefix}S_L', None)) if prefix == 'T_' else None,
        "T_LDT_L": safe_json(getattr(anal_data, f'{prefix}LDT_L', None)) if prefix == 'T_' else None,
        "T_HDT_L": safe_json(getattr(anal_data, f'{prefix}HDT_L', None)) if prefix == 'T_' else None,
    }


# ===============================================
# 분석 데이터 조회 API
# ===============================================

class Get_UserOvr_last_5_matches_From_Player(APIView):
    """
    사용자 OVR 데이터 조회 API
    사용자의 최근 5경기 OVR 데이터를 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_description="사용자의 최근 5경기 OVR 데이터를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description="사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """사용자 OVR 데이터 조회"""
        user_code = request.query_params.get('user_code')
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 플레이어 매치 데이터 조회 (최근 5경기, PlayerMatch.start_time 기준)
            # 삭제되지 않은 경기만 조회
            player_match_codes_qs = PlayerMatchCross.objects.filter(
                user_code=user_code,
                deleted_at__isnull=True
            ).values_list('match_code', flat=True).distinct()
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
            match_max_attacks = []
            match_max_defenses = []
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
                    match_max_attacks.append(max_values['max_attack'])
                    match_max_defenses.append(max_values['max_defense'])
                    match_max_sprints.append(max_values['max_sprint'])
                    match_max_accelerations.append(max_values['max_acceleration'])
                    match_max_speeds.append(max_values['max_speed'])
                    match_max_positivenesses.append(max_values['max_positiveness'])
                    match_max_staminas.append(max_values['max_stamina'])
                            
                except Exception:
                    # 경기 데이터 오류시 0으로 추가
                    match_max_totals.append(0)
                    match_max_attacks.append(0)
                    match_max_defenses.append(0)
                    match_max_sprints.append(0)
                    match_max_accelerations.append(0)
                    match_max_speeds.append(0)
                    match_max_positivenesses.append(0)
                    match_max_staminas.append(0)
            
            # 디버그용 전체 쿼터 데이터 수집 (미니차트 루프에서 수집됨)
            all_quarter_totals = []
            all_quarter_sprints = []

            # 8가지 지표 평균 계산 (각 경기의 최고 쿼터 점수들의 평균)
            if match_max_totals:
                # OVR (total) 계산 - 각 경기 최고 쿼터 점수들의 평균
                ovr = sum(match_max_totals) / len(match_max_totals)
                ovr = int(round(ovr))  # 정수로 변환
                
                # 나머지 7가지 지표 계산 - 각 경기 최고 쿼터 점수들의 평균
                avg_attack = int(round(sum(match_max_attacks) / len(match_max_attacks))) if match_max_attacks else 0
                avg_defense = int(round(sum(match_max_defenses) / len(match_max_defenses))) if match_max_defenses else 0
                avg_sprint = int(round(sum(match_max_sprints) / len(match_max_sprints))) if match_max_sprints else 0
                avg_acceleration = int(round(sum(match_max_accelerations) / len(match_max_accelerations))) if match_max_accelerations else 0
                avg_speed = int(round(sum(match_max_speeds) / len(match_max_speeds))) if match_max_speeds else 0
                avg_positiveness = int(round(sum(match_max_positivenesses) / len(match_max_positivenesses))) if match_max_positivenesses else 0
                avg_stamina = int(round(sum(match_max_staminas) / len(match_max_staminas))) if match_max_staminas else 0
                
                
            else:
                # 데이터가 없는 경우 모든 지표 0으로 설정
                ovr = 0
                avg_attack = 0
                avg_defense = 0
                avg_sprint = 0
                avg_acceleration = 0
                avg_speed = 0
                avg_positiveness = 0
                avg_stamina = 0
            
            # 각 경기의 쿼터 중 최대값으로 미니 차트 데이터 구성
            match_max_point_totals = []
            match_max_point_attacks = []
            match_max_point_defenses = []
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
                    match_max_point_attacks.append(max_values['max_attack'])
                    match_max_point_defenses.append(max_values['max_defense'])
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
                    match_max_point_attacks.append(0)
                    match_max_point_defenses.append(0)
                    match_max_distances.append(0)
                    match_max_speeds.append(0)
                    match_max_sprints.append(0)
                    match_dates.append(None)

            # 길이를 5로 보정 (부족하면 0 패딩)
            match_max_point_totals = _pad_list_to_five(match_max_point_totals, 0)
            match_max_point_attacks = _pad_list_to_five(match_max_point_attacks, 0)
            match_max_point_defenses = _pad_list_to_five(match_max_point_defenses, 0)
            match_max_distances = _pad_list_to_five(match_max_distances, 0)
            match_max_speeds = _pad_list_to_five(match_max_speeds, 0)
            match_max_sprints = _pad_list_to_five(match_max_sprints, 0)
            match_dates = _pad_list_to_five(match_dates, None)

            # 최신 경기가 마지막에 오도록 순서 뒤집기 (그래프 및 현재값 표시 일관성)
            match_max_point_totals = list(reversed(match_max_point_totals[:5]))
            match_max_point_attacks = list(reversed(match_max_point_attacks[:5]))
            match_max_point_defenses = list(reversed(match_max_point_defenses[:5]))
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
                
                # 8가지 지표 데이터
                "point": {
                    "total": ovr,
                    "attack": avg_attack,
                    "defense": avg_defense,
                    "sprint": avg_sprint,
                    "acceleration": avg_acceleration,
                    "speed": avg_speed,
                    "positiveness": avg_positiveness,
                    "stamina": avg_stamina
                },
                
                # 레이더 차트용 데이터 (동일한 값)
                "radar_data": {
                    "point_total": ovr,
                    "point_attack": avg_attack,
                    "point_defense": avg_defense,
                    "point_sprint": avg_sprint,
                    "point_acceleration": avg_acceleration,
                    "point_speed": avg_speed,
                    "point_positiveness": avg_positiveness,
                    "point_stamina": avg_stamina
                },
                
                # 하단 미니 차트 데이터 (각 경기의 쿼터 최대값 기반)
                "mini_chart_data": {
                    "point_total": match_max_point_totals,
                    "point_attack": match_max_point_attacks,
                    "point_defense": match_max_point_defenses,
                    "distance": match_max_distances,
                    "max_speed": match_max_speeds,
                    "sprint": match_max_sprints,
                    "dates": match_dates
                },
                
                # 디버그 정보
                "debug_info": {
                    "quarter_data_count": len(all_quarter_totals),
                    "raw_totals": all_quarter_totals[:10] if len(all_quarter_totals) > 10 else all_quarter_totals,
                    "raw_sprints": all_quarter_sprints[:10] if len(all_quarter_sprints) > 10 else all_quarter_sprints
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"사용자 OVR 데이터 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Get_UserPoint_last_5_matches_From_Player(APIView):
    """
    사용자 통계 데이터 조회 API
    사용자의 최근 5경기 통계 데이터를 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_description="사용자의 최근 5경기 통계 데이터를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description="사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """사용자 통계 데이터 조회"""
        user_code = request.query_params.get('user_code')
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 플레이어 매치 데이터 조회
            matches_count = PlayerMatchCross.objects.filter(
                user_code=user_code,
                deleted_at__isnull=True
            ).count()
            
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
            
            return Response(stats_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"사용자 통계 데이터 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Get_QuarterData_From_Player(APIView):
    """
    쿼터 분석 데이터 조회 API
    쿼터 코드로 쿼터의 전체 분석 데이터를 조회합니다 (PlayerAnal 모델 기반).
    """
    
    @swagger_auto_schema(
        operation_description="쿼터의 전체 분석 데이터를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description="사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'quarter_code',
                openapi.IN_QUERY,
                description="쿼터 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="쿼터 또는 분석 데이터를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """쿼터 분석 데이터 조회"""
        user_code = request.query_params.get('user_code')
        quarter_code = request.query_params.get('quarter_code')
        
        if not all([user_code, quarter_code]):
            return Response(
                {"error": "user_code and quarter_code parameters are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            
            # 쿼터 정보 조회
            try:
                quarter = PlayerQuarter.objects.get(quarter_code=quarter_code)
            except PlayerQuarter.DoesNotExist:
                return Response({
                    "error": "Quarter not found."
                }, status=status.HTTP_404_NOT_FOUND)
            
            # deleted_at 필드가 있는 경우에만 체크 (모델에 필드가 없을 수 있음)
            if hasattr(quarter, 'deleted_at') and quarter.deleted_at is not None:
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
                "home": quarter.home
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
                    "home": getattr(match_info, 'home', None)
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
                "time_noise": float(anal_data.N_T or 0),
                "gps_noise": float(anal_data.N_G or 0),
                "reliability": float(anal_data.N_P or 0)
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
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            import traceback
            error_detail = traceback.format_exc()
            print(f"❌ Get_QuarterData_From_Player 에러 발생:")
            print(f"   user_code: {user_code}")
            print(f"   quarter_code: {quarter_code}")
            print(f"   에러 메시지: {str(e)}")
            print(f"   상세 에러:\n{error_detail}")
            return Response(
                {
                    "error": f"쿼터 분석 데이터 조회 중 오류가 발생했습니다: {str(e)}",
                    "detail": error_detail if settings.DEBUG else None
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Start_PlayerAnalysis_Lambda(APIView):
    """
    플레이어 분석 시작 API
    Lambda 함수를 호출하여 플레이어 분석을 시작합니다.
    """
    
    @swagger_auto_schema(
        operation_description="Lambda 함수를 호출하여 플레이어 분석을 시작합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'upload_code': openapi.Schema(type=openapi.TYPE_STRING, description='업로드 코드'),
                'ground_code': openapi.Schema(type=openapi.TYPE_STRING, description='경기장 코드'),
                'rest_area_position': openapi.Schema(type=openapi.TYPE_STRING, description='휴식 공간 위치 (A 또는 B)'),
                'match_name': openapi.Schema(type=openapi.TYPE_STRING, description='경기 이름'),
                'quarters': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    description='쿼터 정보 배열',
                    items=openapi.Schema(type=openapi.TYPE_OBJECT)
                )
            },
            required=['user_code', 'upload_code', 'ground_code', 'rest_area_position']
        ),
        responses={
            201: openapi.Response(description="분석 시작 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="리소스를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """플레이어 분석 시작"""
        try:
            # 요청 데이터 검증
            user_code = request.data.get('user_code')
            upload_code = request.data.get('upload_code')
            ground_code = request.data.get('ground_code')
            rest_area_position = request.data.get('rest_area_position')
            match_name = request.data.get('match_name')  # 경기 이름 추가
            quarters = request.data.get('quarters', [])
            
            # 필수 파라미터 검증
            if not all([user_code, upload_code, ground_code, rest_area_position]):
                return Response({
                    "error": "필수 파라미터가 누락되었습니다.",
                    "required": ["user_code", "upload_code", "ground_code", "rest_area_position"]
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not quarters or len(quarters) == 0:
                return Response({
                    "error": "최소 1개 이상의 쿼터 정보가 필요합니다."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # DB 데이터 존재 여부 확인 및 정보 조회
            user = get_object_or_404(User, user_code=user_code, deleted_at__isnull=True)
            upload = get_object_or_404(Upload, upload_code=upload_code, deleted_at__isnull=True)
            ground = get_object_or_404(GroundInfo, ground_code=ground_code, deleted_at__isnull=True)
            
            # UserInfo에서 level 조회 및 매핑
            try:
                from DB.models import UserInfo
                user_info = UserInfo.objects.get(user_code=user_code, deleted_at__isnull=True)
                raw_level = user_info.level if user_info.level else 'amateur'
                
                # level을 분석 모듈이 인식하는 형식으로 매핑
                level_lower = raw_level.lower()
                if 'pro' in level_lower or '프로' in raw_level or '전문' in raw_level:
                    player_type = 'pro'
                elif 'youth' in level_lower or '유소년' in raw_level or '청소년' in raw_level:
                    player_type = 'youth'
                else:
                    player_type = 'amateur'  # 기본값 (amateur 포함)
                    
                print(f"[백엔드] UserInfo.level: '{raw_level}' → 매핑: '{player_type}'")
            except UserInfo.DoesNotExist:
                player_type = 'amateur'  # 기본값
                print(f"[백엔드] UserInfo 없음, 기본값 사용: '{player_type}'")
            
            # Upload에서 hz 조회
            hz_value = upload.hz if upload.hz else 10
            
            print(f"[백엔드] 최종 선수 타입: {player_type}, Hz: {hz_value}")
            
            # Match 생성 (분석 요청마다 새로운 경기 생성)
            match_code = f"m_{uuid.uuid4().hex[:12]}"
            
            # 첫 쿼터와 마지막 쿼터 시간 정보 추출
            first_quarter = quarters[0]
            last_quarter = quarters[-1]
            
            # 시간 문자열을 DateTimeField로 변환 (USE_TZ=False이므로 naive datetime 사용)
            from datetime import datetime, time, timedelta
            
            # 디버깅: 받은 쿼터 데이터 확인
            print(f"[백엔드] 첫 쿼터 데이터: {first_quarter}")
            
            # 첫 쿼터의 game_date 사용 (실제 경기 날짜)
            if first_quarter.get('game_date'):
                game_date = datetime.strptime(first_quarter['game_date'], '%Y-%m-%d').date()
                print(f"[백엔드] 경기 날짜: {game_date} (쿼터 데이터에서)")
            else:
                game_date = datetime.now().date()
                print(f"[백엔드] 경기 날짜: {game_date} (오늘 날짜 사용)")
            
            # 시작 시간 파싱 (naive datetime)
            start_hour, start_minute = map(int, first_quarter['start_time'].split(':'))
            start_datetime = datetime.combine(game_date, time(hour=start_hour, minute=start_minute))
            print(f"[백엔드] Match 시작 시간: {start_datetime}")
            
            # 종료 시간 파싱 (naive datetime) - 마지막 쿼터의 날짜 사용
            if last_quarter.get('game_date'):
                last_game_date = datetime.strptime(last_quarter['game_date'], '%Y-%m-%d').date()
            else:
                last_game_date = game_date
                
            end_hour, end_minute = map(int, last_quarter['end_time'].split(':'))
            end_datetime = datetime.combine(last_game_date, time(hour=end_hour, minute=end_minute))
            
            # 종료 시간이 시작 시간보다 이전이면 다음날로 간주
            if end_datetime < start_datetime:
                end_datetime = end_datetime + timedelta(days=1)
            
            # PlayerMatch 생성 (USE_TZ=False이므로 created_at 자동 설정)
            # standard 필드에 휴식 공간 위치 저장 (A=north, B=south → north/south 직접 변환)
            rest_area_direction = 'north' if rest_area_position == 'A' else 'south'
            standard_value = rest_area_direction
            print(f"[백엔드] PlayerMatch.standard 저장: '{standard_value}' (rest_area_position='{rest_area_position}')")
            
            player_match = PlayerMatch.objects.create(
                match_code=match_code,
                upload_code=upload_code,  # upload_code 필드 추가
                ground_code=ground_code,
                start_time=start_datetime,
                end_time=end_datetime,
                name=match_name if match_name else 'GPS 분석',  # 경기 이름 사용
                status='anal',  # 분석 시작 상태
                standard=standard_value  # 휴식 공간 위치 (A→north, B→south)
            )
            
            # PlayerMatchCross 생성 (유저와 경기 연결)
            PlayerMatchCross.objects.create(
                match_code=match_code,
                user_code=user_code
            )
            
            # 각 쿼터별 데이터 생성
            quarter_codes = []
            for quarter_info in quarters:
                quarter_code = f"q_{uuid.uuid4().hex[:12]}"
                quarter_codes.append(quarter_code)
                
                # 각 쿼터의 game_date 사용 (실제 경기 날짜)
                if quarter_info.get('game_date'):
                    quarter_game_date = datetime.strptime(quarter_info['game_date'], '%Y-%m-%d').date()
                else:
                    quarter_game_date = game_date  # 첫 쿼터 날짜 사용
                
                # 쿼터 시작/종료 시간 파싱 (naive datetime)
                q_start_hour, q_start_minute = map(int, quarter_info['start_time'].split(':'))
                q_start_datetime = datetime.combine(quarter_game_date, time(hour=q_start_hour, minute=q_start_minute))
                
                q_end_hour, q_end_minute = map(int, quarter_info['end_time'].split(':'))
                q_end_datetime = datetime.combine(quarter_game_date, time(hour=q_end_hour, minute=q_end_minute))
                
                # 종료 시간이 시작 시간보다 이전이면 다음날로 간주
                if q_end_datetime < q_start_datetime:
                    q_end_datetime = q_end_datetime + timedelta(days=1)
                
                # PlayerQuarter 생성 (USE_TZ=False이므로 created_at 자동 설정)
                # status: ENUM('play', 'rest')
                # home: ENUM('west', 'east')
                if quarter_info['home_position'] == '오른쪽':
                    home_value = 'east' if rest_area_direction == 'south' else 'west'
                elif quarter_info['home_position'] == '왼쪽':
                    home_value = 'east' if rest_area_direction == 'north' else 'west'
                else:
                    if quarter_info['is_playing']:
                        return Response(
                            {
                                "error": f"쿼터 '{quarter_info['quarter_name']}'의 home_position 값이 누락되었거나 잘못되었습니다."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    home_value = 'rest'
                
                PlayerQuarter.objects.create(
                    quarter_code=quarter_code,
                    name=quarter_info['quarter_name'],
                    start_time=q_start_datetime,
                    end_time=q_end_datetime,
                    status='play' if quarter_info['is_playing'] else 'rest',
                    home=home_value
                )
                
                # PlayerMatchQuarterCross 생성 (경기와 쿼터 연결)
                PlayerMatchQuarterCross.objects.create(
                    match_code=match_code,
                    quarter_code=quarter_code
                )
            
            # Lambda 호출을 위한 페이로드 구성
            # rest_area_position 변환: A → north, B → south
            print(f"[백엔드] 받은 rest_area_position: '{rest_area_position}' (타입: {type(rest_area_position)})")
            rest_area_for_lambda = rest_area_direction
            print(f"[백엔드] Lambda로 전송할 rest_area: '{rest_area_for_lambda}'")
            
            # quarters 데이터 변환
            quarters_for_lambda = []
            for idx, quarter in enumerate(quarters):
                # is_playing 변환: true → play, false → rest
                status_value = 'play' if quarter.get('is_playing') else 'rest'
                
                # home_position 변환: 오른쪽 → east, 왼쪽 → west, 미선택 → rest
                home_position = quarter.get('home_position')
                if home_position == '오른쪽':
                    home_value = 'east' if rest_area_for_lambda == 'south' else 'west'
                elif home_position == '왼쪽':
                    home_value = 'east' if rest_area_for_lambda == 'north' else 'west'
                else:
                    if quarter.get('is_playing'):
                        return Response(
                            {
                                "error": f"쿼터 '{quarter.get('quarter_name')}'의 home_position 값이 누락되었거나 잘못되었습니다."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    home_value = 'rest'
                
                # 각 쿼터의 game_date 사용 (실제 경기 날짜)
                if quarter.get('game_date'):
                    q_game_date = datetime.strptime(quarter['game_date'], '%Y-%m-%d').date()
                    print(f"[백엔드] 쿼터 {quarter.get('quarter_name')}: game_date={quarter.get('game_date')} → {q_game_date}")
                else:
                    q_game_date = game_date  # 첫 쿼터 날짜 fallback
                    print(f"[백엔드] 쿼터 {quarter.get('quarter_name')}: game_date 없음, fallback={q_game_date}")
                
                # Lambda를 위해 시간을 datetime 형식으로 변환
                q_start_hour, q_start_minute = map(int, quarter.get('start_time').split(':'))
                q_start_datetime = datetime.combine(q_game_date, time(hour=q_start_hour, minute=q_start_minute))
                
                q_end_hour, q_end_minute = map(int, quarter.get('end_time').split(':'))
                q_end_datetime = datetime.combine(q_game_date, time(hour=q_end_hour, minute=q_end_minute))
                
                # 종료 시간이 시작 시간보다 이전이면 다음날로 간주
                if q_end_datetime < q_start_datetime:
                    q_end_datetime = q_end_datetime + timedelta(days=1)
                
                print(f"[백엔드] Lambda 전송 시간: {q_start_datetime.strftime('%Y-%m-%d %H:%M:%S')} ~ {q_end_datetime.strftime('%Y-%m-%d %H:%M:%S')}")
                
                quarters_for_lambda.append({
                    "quarter_number": quarter.get('quarter_number'),
                    "quarter_name": quarter.get('quarter_name'),
                    "start_time": q_start_datetime.strftime('%Y-%m-%d %H:%M:%S'),
                    "end_time": q_end_datetime.strftime('%Y-%m-%d %H:%M:%S'),
                    "status": status_value,
                    "home": home_value
                })
            
            # Ground 정보를 Lambda payload에 포함
            ground_info = {
                "name": ground.name,
                "center": ground.center if ground.center else [0.0, 0.0],
                "rotate_deg": float(ground.rotate_deg) if ground.rotate_deg else 0.0,
                "new_short": ground.new_short if ground.new_short else [0.0, 100.0],
                "new_long": ground.new_long if ground.new_long else [0.0, 100.0]
            }
            
            lambda_payload = {
                "user_code": user_code,
                "upload_code": upload_code,
                "ground_code": ground_code,
                "ground_info": ground_info,  # Ground 정보
                "match_code": match_code,
                "rest_area_position": rest_area_for_lambda,
                "quarter_codes": quarter_codes,
                "quarters": quarters_for_lambda,
                "player_type": player_type,  # DB에서 조회한 선수 타입
                "hz": hz_value,  # DB에서 조회한 GPS Hz
                "metadata": request.data.get('metadata', {})
            }
            
            # TODO: Lambda 함수 호출 (비동기 호출 권장)
            # Lambda ARN 또는 API Gateway URL 필요
            lambda_result = self._invoke_lambda(lambda_payload)
            
            return Response({
                "success": True,
                "message": "분석이 시작되었습니다.",
                "match_code": match_code,
                "quarter_codes": quarter_codes,
                "lambda_status": lambda_result.get('status', 'pending'),
                "created_at": datetime.now().isoformat()
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"error": f"분석 시작 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _invoke_lambda(self, payload):
        """
        API Gateway를 통해 Lambda 함수 호출
        
        API Gateway 정보:
        - URL: https://0udto5otv4.execute-api.ap-northeast-2.amazonaws.com/default/Agrounds_player_anal
        - Method: ANY (POST로 호출)
        - 인증: AWS_IAM (서명 필요)
        """
        try:
            # API Gateway 엔드포인트
            api_gateway_url = 'https://0udto5otv4.execute-api.ap-northeast-2.amazonaws.com/default/Agrounds_player_anal'
            
            # AWS Credentials 가져오기
            aws_access_key = getattr(settings, 'AWS_ACCESS_KEY_ID', None)
            aws_secret_key = getattr(settings, 'AWS_SECRET_ACCESS_KEY', None)
            region = getattr(settings, 'AWS_REGION_NAME', 'ap-northeast-2')
            
            # AWS IAM 인증 설정
            auth = None
            if HAS_AWS4AUTH and aws_access_key and aws_secret_key:
                # AWS Signature Version 4 인증 생성
                auth = AWS4Auth(
                    aws_access_key,
                    aws_secret_key,
                    region,
                    'execute-api'  # API Gateway 서비스
                )
                print("AWS IAM 인증 활성화")
            else:
                print("AWS IAM 인증 비활성화 (인증 없이 시도)")
            
            try:
                # POST 요청으로 Lambda 호출
                # Lambda는 백그라운드에서 실행되므로 timeout 응답도 정상으로 처리
                response = requests.post(
                    api_gateway_url,
                    json=payload,
                    headers={
                        'Content-Type': 'application/json'
                    },
                    auth=auth,  # AWS IAM 인증
                    timeout=60  # 60초 타임아웃 (Lambda 실행 시간 고려)
                )
                
                print(f"Lambda 호출 응답: Status {response.status_code}")
                
                # 응답 확인
                if response.status_code == 200 or response.status_code == 504:
                    # 200: 정상 응답, 504: Gateway Timeout (Lambda는 백그라운드에서 계속 실행)
                    response_data = None
                    try:
                        response_data = response.json() if response.text else None
                    except:
                        response_data = {"raw": response.text}
                    
                    return {
                        "status": "invoked",
                        "status_code": response.status_code,
                        "message": "Lambda 함수가 호출되었습니다. 분석은 백그라운드에서 진행됩니다.",
                        "response": response_data
                    }
                elif response.status_code == 403:
                    # IAM 인증 필요 또는 실패
                    error_msg = "API Gateway IAM 인증이 필요하거나 실패했습니다."
                    if not HAS_AWS4AUTH:
                        error_msg += " requests-aws4auth 라이브러리를 설치해주세요: pip install requests-aws4auth"
                    elif not (aws_access_key and aws_secret_key):
                        error_msg += " AWS credentials가 설정되지 않았습니다."
                    
                    return {
                        "status": "auth_required",
                        "status_code": response.status_code,
                        "message": error_msg,
                        "error": response.text
                    }
                else:
                    return {
                        "status": "error",
                        "status_code": response.status_code,
                        "message": f"Lambda 호출 실패: HTTP {response.status_code}",
                        "error": response.text
                    }
                    
            except requests.exceptions.Timeout:
                # Timeout은 정상입니다 - Lambda는 백그라운드에서 계속 실행됩니다
                return {
                    "status": "invoked",
                    "message": "Lambda 함수가 호출되었습니다. 분석은 백그라운드에서 진행됩니다."
                }
            except requests.exceptions.RequestException as e:
                return {
                    "status": "failed",
                    "error": str(e),
                    "message": "Lambda 호출 중 네트워크 오류가 발생했습니다."
                }
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Lambda 호출 실패: {str(e)}")
            return {
                "status": "failed",
                "error": str(e),
                "message": "Lambda 호출에 실패했습니다."
            }


class Save_AnalysisResult_From_Lambda(APIView):
    """
    Lambda 분석 결과 저장 API
    Lambda 함수에서 분석 결과를 받아 PlayerAnal 테이블에 저장합니다.
    """
    
    @swagger_auto_schema(
        operation_description="Lambda 함수에서 분석 결과를 받아 저장합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'quarter_code': openapi.Schema(type=openapi.TYPE_STRING, description='쿼터 코드'),
                'analysis_data': openapi.Schema(type=openapi.TYPE_OBJECT, description='분석 데이터')
            },
            required=['quarter_code']
        ),
        responses={
            200: openapi.Response(description="저장/수정 성공"),
            201: openapi.Response(description="생성 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """Lambda 분석 결과 저장"""
        try:
            quarter_code = request.data.get('quarter_code')
            analysis_data = request.data.get('analysis_data', {})
            
            # 디버깅: 받은 데이터 로그
            print(f"[Save Analysis] quarter_code: {quarter_code}")
            print(f"[Save Analysis] analysis_data: {analysis_data}")
            
            if not quarter_code:
                return Response({
                    "error": "quarter_code is required."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Quarter 존재 확인 (없으면 자동 생성 - Lambda에서 이미 생성했어야 하지만 fallback)
            try:
                quarter = PlayerQuarter.objects.get(quarter_code=quarter_code)
            except PlayerQuarter.DoesNotExist:
                # Quarter가 없으면 그냥 경고 로그만 남기고 계속 진행
                print(f"Warning: PlayerQuarter {quarter_code} not found, creating PlayerAnal anyway")
                quarter = None
            
            # PlayerAnal 레코드가 이미 있는지 확인
            existing_anal = PlayerAnal.objects.filter(quarter_code=quarter_code).first()
            
            if existing_anal:
                # 업데이트
                for key, value in analysis_data.items():
                    if hasattr(existing_anal, key):
                        setattr(existing_anal, key, value)
                existing_anal.save()
                
                response_data = {
                    "success": True,
                    "message": "분석 결과가 업데이트되었습니다.",
                    "quarter_code": quarter_code,
                    "updated": True
                }
            else:
                # 새로 생성
                PlayerAnal.objects.create(
                    quarter_code=quarter_code,
                    **analysis_data
                )
                
                response_data = {
                    "success": True,
                    "message": "분석 결과가 저장되었습니다.",
                    "quarter_code": quarter_code,
                    "created": True
                }
            
            # 해당 쿼터가 속한 경기의 모든 쿼터가 완료되었는지 확인
            try:
                # 쿼터가 속한 경기 찾기
                quarter_cross = PlayerMatchQuarterCross.objects.filter(
                    quarter_code=quarter_code,
                    deleted_at__isnull=True
                ).first()
                
                if quarter_cross:
                    match_code = quarter_cross.match_code
                    
                    # 해당 경기의 모든 쿼터 코드 가져오기
                    all_quarter_crosses = PlayerMatchQuarterCross.objects.filter(
                        match_code=match_code,
                        deleted_at__isnull=True
                    )
                    all_quarter_codes = [qc.quarter_code for qc in all_quarter_crosses]
                    
                    # 각 쿼터에 대해 PlayerAnal이 존재하는지 확인
                    # PlayerAnal 모델에는 deleted_at 필드가 없으므로 해당 조건을 사용하지 않음
                    completed_quarters = PlayerAnal.objects.filter(
                        quarter_code__in=all_quarter_codes
                    ).count()
                    
                    print(f"[Match Status Check] Match: {match_code}, Total quarters: {len(all_quarter_codes)}, Completed: {completed_quarters}")
                    
                    # 모든 쿼터가 완료되었으면 PlayerMatch의 status를 'anal_done'으로 업데이트
                    if completed_quarters == len(all_quarter_codes):
                        # PlayerMatch 모델에는 deleted_at 필드가 없으므로 해당 조건을 사용하지 않음
                        player_match = PlayerMatch.objects.filter(
                            match_code=match_code
                        ).first()
                        
                        if player_match and player_match.status == 'anal':
                            player_match.status = 'anal_done'
                            player_match.save()
                            print(f"[GPS Analysis Complete] Match {match_code} status updated to 'anal_done'")
                            response_data['match_status'] = 'anal_done'
                            response_data['analysis_completed'] = True
                        else:
                            response_data['match_status'] = player_match.status if player_match else None
                    else:
                        response_data['match_status'] = 'anal'
                        response_data['progress'] = f"{completed_quarters}/{len(all_quarter_codes)}"
                        
            except Exception as e:
                # 경기 상태 업데이트 실패는 로그만 남기고 계속 진행
                print(f"[Match Status Update Error] {str(e)}")
                import traceback
                traceback.print_exc()
            
            return Response(
                response_data,
                status=status.HTTP_200_OK if existing_anal else status.HTTP_201_CREATED
            )
                
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"error": f"분석 결과 저장 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Update_MatchStatus_From_Lambda(APIView):
    """
    경기 상태 업데이트 API
    Lambda 함수에서 경기 상태를 업데이트합니다.
    """
    
    @swagger_auto_schema(
        operation_description="Lambda 함수에서 경기 상태를 업데이트합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'match_code': openapi.Schema(type=openapi.TYPE_STRING, description='경기 코드'),
                'status': openapi.Schema(type=openapi.TYPE_STRING, description='경기 상태'),
                'error_message': openapi.Schema(type=openapi.TYPE_STRING, description='에러 메시지 (선택사항)')
            },
            required=['match_code', 'status']
        ),
        responses={
            200: openapi.Response(description="상태 업데이트 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="경기를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def patch(self, request):
        """경기 상태 업데이트"""
        try:
            match_code = request.data.get('match_code')
            new_status = request.data.get('status')
            error_message = request.data.get('error_message', '')
            
            if not match_code:
                return Response({
                    "error": "match_code is required."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not new_status:
                return Response({
                    "error": "status is required."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 유효한 status 값 확인
            valid_statuses = ['anal', 'anal_done', 'ai', 'ai_done', 'anal_fail', 'ai_fail']
            if new_status not in valid_statuses:
                return Response({
                    "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # PlayerMatch 조회 (교차 테이블의 deleted_at으로 필터링되므로 직접 deleted_at 조건 사용 안 함)
            try:
                player_match = PlayerMatch.objects.get(
                    match_code=match_code
                )
            except PlayerMatch.DoesNotExist:
                return Response({
                    "error": f"Match not found: {match_code}"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # status 업데이트
            old_status = player_match.status
            player_match.status = new_status
            player_match.save()
            
            print(f"[Match Status Update] {match_code}: {old_status} → {new_status}")
            if error_message:
                print(f"[Match Error] {match_code}: {error_message}")
            
            return Response({
                "success": True,
                "message": "Match status updated successfully",
                "match_code": match_code,
                "old_status": old_status,
                "new_status": new_status,
                "error_message": error_message if error_message else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"error": f"경기 상태 업데이트 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Save_PlayerAi_From_Lambda(APIView):
    """
    PlayerAi 저장 API
    Lambda 함수에서 GPT 분석 결과를 받아 PlayerAi 테이블에 저장합니다.
    """
    
    @swagger_auto_schema(
        operation_description="Lambda 함수에서 GPT 분석 결과를 받아 저장합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'match_code': openapi.Schema(type=openapi.TYPE_STRING, description='경기 코드'),
                'answer': openapi.Schema(type=openapi.TYPE_OBJECT, description='GPT 분석 결과')
            },
            required=['match_code']
        ),
        responses={
            200: openapi.Response(description="저장/수정 성공"),
            201: openapi.Response(description="생성 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """PlayerAi 저장"""
        try:
            match_code = request.data.get('match_code')
            answer = request.data.get('answer', {})
            
            # 디버깅: 받은 데이터 로그
            print(f"[Save PlayerAi] match_code: {match_code}")
            print(f"[Save PlayerAi] answer keys: {list(answer.keys())}")
            
            if not match_code:
                return Response({
                    "error": "match_code is required."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # PlayerAi 레코드가 이미 있는지 확인
            existing_ai = PlayerAi.objects.filter(
                match_code=match_code,
                deleted_at__isnull=True
            ).first()
            
            if existing_ai:
                # 업데이트 (Soft Delete 패턴 유지)
                existing_ai.answer = answer
                existing_ai.save()
                
                response_data = {
                    "success": True,
                    "message": "PlayerAi 결과가 업데이트되었습니다.",
                    "match_code": match_code,
                    "updated": True
                }
            else:
                # 새로 생성
                PlayerAi.objects.create(
                    match_code=match_code,
                    answer=answer
                )
                
                response_data = {
                    "success": True,
                    "message": "PlayerAi 결과가 저장되었습니다.",
                    "match_code": match_code,
                    "created": True
                }
            
            print(f"[PlayerAi Saved] Match: {match_code}")
            
            return Response(
                response_data,
                status=status.HTTP_200_OK if existing_ai else status.HTTP_201_CREATED
            )
                
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"error": f"PlayerAi 저장 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Create_AnalysisNotification_From_Lambda(APIView):
    """
    분석 완료 알림 생성 API
    Lambda 함수에서 호출하여 Notification 레코드를 생성합니다.
    """
    
    @swagger_auto_schema(
        operation_description="분석 완료 알림을 생성합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='알림 수신자 사용자 코드'),
                'match_code': openapi.Schema(type=openapi.TYPE_STRING, description='경기 코드'),
                'upload_code': openapi.Schema(type=openapi.TYPE_STRING, description='업로드 코드', nullable=True),
                'metadata': openapi.Schema(type=openapi.TYPE_OBJECT, description='추가 메타데이터', nullable=True)
            },
            required=['user_code', 'match_code']
        ),
        responses={
            200: openapi.Response(description="이미 생성된 알림 반환"),
            201: openapi.Response(description="알림 생성 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        try:
            user_code = request.data.get('user_code')
            match_code = request.data.get('match_code')
            upload_code = request.data.get('upload_code')
            metadata = request.data.get('metadata') or {}
            
            if not user_code or not match_code:
                return Response(
                    {"error": "user_code and match_code are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            existing_notification = Notification.objects.filter(
                recipient_code=user_code,
                notification_type='analysis_completed',
                deleted_at__isnull=True,
                is_deleted=False,
                related_data__match_code=match_code
            ).first()
            
            if existing_notification:
                return Response(
                    {
                        "notification_id": existing_notification.notification_id,
                        "created": False
                    },
                    status=status.HTTP_200_OK
                )
            
            # PlayerMatch 모델에는 deleted_at 필드가 없으므로 해당 조건을 사용하지 않음
            match = PlayerMatch.objects.filter(
                match_code=match_code
            ).first()
            
            match_name = metadata.get('match_name') or (match.name if match else "경기")
            match_time_str = None
            if match and match.start_time:
                match_time_str = match.start_time.strftime("%Y-%m-%d %H:%M")
            
            title = f"{match_name} 분석이 완료되었습니다"
            if len(title) > 100:
                title = title[:97] + "..."
            
            message = f"{match_name}"
            if match_time_str:
                message += f" ({match_time_str})"
            message += " 경기 분석이 완료되었습니다. 상세 리포트를 확인해보세요."
            
            related_data = {
                "match_code": match_code,
                "status": "ai_done"
            }
            if upload_code:
                related_data["upload_code"] = upload_code
            if match_name:
                related_data["match_name"] = match_name
            if match_time_str:
                related_data["match_start_time"] = match_time_str
            if metadata:
                related_data["metadata"] = metadata
            
            notification = Notification.objects.create(
                recipient_code=user_code,
                sender_code=None,
                category='analysis',
                notification_type='analysis_completed',
                priority='normal',
                title=title,
                message=message,
                short_message='분석 완료',
                related_data=related_data
            )
            
            return Response(
                {
                    "notification_id": notification.notification_id,
                    "created": True
                },
                status=status.HTTP_201_CREATED
            )
        
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"error": f"알림 생성 중 오류가 발생했습니다: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )