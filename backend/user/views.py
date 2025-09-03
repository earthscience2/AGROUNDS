from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from django.db.models import Avg, Count, Sum
from django.utils import timezone
from datetime import datetime
import json

# 명시적 모델 임포트
from DB.models import (
    UserInfo, PlayerAnal, PlayerMatch, PlayerMatchCross, 
    PlayerQuarter, PlayerMatchQuarterCross
)
from .serializers import UserChangeSerializer

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class SetUserChange(APIView):
    """
    사용자 정보 수정 API
    사용자의 개인 정보를 업데이트합니다.
    """
    
    @swagger_auto_schema(
        operation_description="사용자 정보를 수정합니다.",
        responses={
            200: openapi.Response(description="수정 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="사용자를 찾을 수 없음")
        }
    )
    def patch(self, request):
        user_code = request.data.get('user_code')
        copied_data = request.data.copy()
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 빈 값들을 제거
        for field_name in request.data:
            value = request.data.get(field_name)
            if not value:
                copied_data.pop(field_name, None)

        user_info = get_object_or_404(UserInfo, user_code=user_code)
        
        serializer = UserChangeSerializer(user_info, data=request.data, partial=True, user_code=user_code)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserAnalysisDataView(APIView):
    """
    사용자 통합 분석 데이터 조회 (OVR, 통계, 레이더 데이터 포함)
    """
    def get(self, request):
        user_code = request.query_params.get('user_code')
        
        if not user_code:
            return Response({"error": "user_code parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 사용자 정보 확인
            user_info = get_object_or_404(UserInfo, user_code=user_code)
            
            # 플레이어 매치 데이터 조회 (match_code 목록 및 경기 시작시간 기준 정렬)
            player_match_codes_qs = PlayerMatchCross.objects.filter(user_code=user_code).values_list('match_code', flat=True).distinct()
            match_codes = list(player_match_codes_qs)
            matches_count = len(match_codes)
            
            if matches_count == 0:
                return Response({
                    "ovr": 0,
                    "matches_count": 0,
                    "message": "분석 후 지표 확인가능해요",
                    "point": {
                        "total": 0,
                        "sprint": 0,
                        "acceleration": 0,
                        "speed": 0,
                        "positiveness": 0,
                        "stamina": 0
                    },
                    "radar_data": {
                        "point_total": 0,
                        "point_sprint": 0,
                        "point_acceleration": 0,
                        "point_speed": 0,
                        "point_positiveness": 0,
                        "point_stamina": 0
                    },
                    "mini_chart_data": {
                        "point_total": [0, 0, 0, 0, 0],
                        "distance": [0, 0, 0, 0, 0],
                        "max_speed": [0, 0, 0, 0, 0],
                        "sprint": [0, 0, 0, 0, 0]
                    }
                })
            
            # 최근 5경기 매치에서 실제 분석 데이터 조회 (PlayerMatch.start_time 기준)
            recent_matches = list(PlayerMatch.objects.filter(match_code__in=match_codes).order_by('-start_time')[:5])
            
            # 최근 5경기의 모든 쿼터 데이터를 수집하여 전체 평균 계산
            all_quarter_totals = []
            all_quarter_sprints = []
            all_quarter_accelerations = []
            all_quarter_speeds = []
            all_quarter_positiveness = []
            all_quarter_staminas = []
            
            distance_data = []
            max_speed_data = []
            sprint_count_data = []
            
            # 최근 경기 데이터 처리
            for match in recent_matches:
                
                # 해당 매치의 quarter들을 가져와서 PlayerAnal 데이터 조회
                try:
                    # PlayerMatchQuarterCross를 사용하여 매치의 쿼터 조회
                    quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match.match_code, deleted_at__isnull=True)
                    # 쿼터 관계 조회
                    
                    match_distance = 0
                    match_max_speed = 0
                    match_sprint_count = 0
                    
                    for quarter_cross in quarter_crosses:
                        try:
                            quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
                            
                            # 삭제된 쿼터는 제외
                            if quarter.deleted_at is not None:
                                continue
                        except PlayerQuarter.DoesNotExist:
                            continue
                        try:
                            anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)
                            
                            # 실제 DB 데이터에서 포인트 정보 추출
                            quarter_total = anal_data.point_total or 0
                            quarter_sprint = anal_data.point_sprint or 0
                            quarter_acceleration = anal_data.point_acceleration or 0
                            quarter_speed = anal_data.point_speed or 0
                            quarter_positiveness = anal_data.point_positiveness or 0
                            quarter_stamina = anal_data.point_stamina or 0
                            
                            # 모든 쿼터의 점수를 개별적으로 수집 (누적이 아닌 개별 점수)
                            all_quarter_totals.append(quarter_total)
                            all_quarter_sprints.append(quarter_sprint)
                            all_quarter_accelerations.append(quarter_acceleration)
                            all_quarter_speeds.append(quarter_speed)
                            all_quarter_positiveness.append(quarter_positiveness)
                            all_quarter_staminas.append(quarter_stamina)
                            
                            # 거리, 속도, 스프린트 데이터 (매치별로 누적)
                            if anal_data.T_D:
                                match_distance += float(anal_data.T_D)
                            if anal_data.T_HS:
                                match_max_speed = max(match_max_speed, float(anal_data.T_HS))
                            if anal_data.T_S:
                                match_sprint_count += int(anal_data.T_S)
                            
                        except PlayerAnal.DoesNotExist:
                            # 분석 데이터가 없는 경우 0 추가
                            all_quarter_totals.append(0)
                            all_quarter_sprints.append(0)
                            all_quarter_accelerations.append(0)
                            all_quarter_speeds.append(0)
                            all_quarter_positiveness.append(0)
                            all_quarter_staminas.append(0)
                    
                    # 매치별 성능 데이터 (거리: km 단위 유지, 속도: km/h, 스프린트: 회수)
                    distance_data.append(round(match_distance, 2))
                    max_speed_data.append(int(match_max_speed))
                    sprint_count_data.append(match_sprint_count)
                    
                except Exception:
                    continue
            
            # 전체 쿼터들의 평균 점수 계산 (누적이 아닌 평균)
            if all_quarter_totals:
                avg_total = sum(all_quarter_totals) / len(all_quarter_totals)
                avg_sprint = sum(all_quarter_sprints) / len(all_quarter_sprints)
                avg_acceleration = sum(all_quarter_accelerations) / len(all_quarter_accelerations)
                avg_speed = sum(all_quarter_speeds) / len(all_quarter_speeds)
                avg_positiveness = sum(all_quarter_positiveness) / len(all_quarter_positiveness)
                avg_stamina = sum(all_quarter_staminas) / len(all_quarter_staminas)
                
                # 정수로 변환
                avg_total = int(round(avg_total))
                avg_sprint = int(round(avg_sprint))
                avg_acceleration = int(round(avg_acceleration))
                avg_speed = int(round(avg_speed))
                avg_positiveness = int(round(avg_positiveness))
                avg_stamina = int(round(avg_stamina))
                
            else:
                # 실제 데이터가 없으면 0으로 설정
                avg_total = 0
                avg_sprint = 0
                avg_acceleration = 0
                avg_speed = 0
                avg_positiveness = 0
                avg_stamina = 0
                
                # 차트 데이터도 0으로 설정
                distance_data = [0, 0, 0, 0, 0]
                max_speed_data = [0, 0, 0, 0, 0]
                sprint_count_data = [0, 0, 0, 0, 0]
            
            # 포인트 데이터 생성
            point_data = {
                "total": avg_total,
                "sprint": avg_sprint,
                "acceleration": avg_acceleration,
                "speed": avg_speed,
                "positiveness": avg_positiveness,
                "stamina": avg_stamina
            }
            
            # 레이더 데이터
            radar_data = {
                "point_total": avg_total,
                "point_sprint": avg_sprint,
                "point_acceleration": avg_acceleration,
                "point_speed": avg_speed,
                "point_positiveness": avg_positiveness,
                "point_stamina": avg_stamina
            }
            
            # 미니 차트 데이터를 위한 매치별 점수 계산
            match_scores = []
            
            for i, match in enumerate(recent_matches):
                try:
                    # PlayerMatchQuarterCross를 사용하여 매치의 쿼터 조회
                    quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match.match_code, deleted_at__isnull=True)
                    match_quarters_totals = []
                    
                    for quarter_cross in quarter_crosses:
                        try:
                            quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
                            
                            # 삭제된 쿼터는 제외
                            if quarter.deleted_at is not None:
                                continue
                        except PlayerQuarter.DoesNotExist:
                            continue
                        try:
                            anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)
                            quarter_total = anal_data.point_total or 0
                            match_quarters_totals.append(quarter_total)
                        except PlayerAnal.DoesNotExist:
                            match_quarters_totals.append(0)
                    
                    # 해당 매치의 평균 점수
                    if match_quarters_totals:
                        match_avg = sum(match_quarters_totals) / len(match_quarters_totals)
                        match_scores.append(int(round(match_avg)))
                        # 매치 평균 점수 계산 완료
                    else:
                        match_scores.append(0)
                        
                except Exception:
                    match_scores.append(0)
            
            # 미니 차트 데이터 (최근 5경기, 부족한 데이터는 패딩)
            while len(match_scores) < 5:
                match_scores.append(0)
            while len(distance_data) < 5:
                distance_data.append(0)
            while len(max_speed_data) < 5:
                max_speed_data.append(0)
            while len(sprint_count_data) < 5:
                sprint_count_data.append(0)
                
            mini_chart_data = {
                "point_total": match_scores[:5],
                "distance": distance_data[:5],
                "max_speed": max_speed_data[:5],
                "sprint": sprint_count_data[:5]
            }
            
            return Response({
                "ovr": avg_total,
                "matches_count": matches_count,
                "message": f"최근 {min(matches_count, 5)}경기 평균 점수",
                "point": point_data,
                "radar_data": radar_data,
                "mini_chart_data": mini_chart_data
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetUserOvrDataView(APIView):
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
                    # 해당 매치의 모든 쿼터 조회 (PlayerMatchQuarterCross 모델 사용)
                    quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match.match_code, deleted_at__isnull=True)
                    
                    # 각 경기별 최고 쿼터 점수 초기화
                    max_total = 0
                    max_sprint = 0
                    max_acceleration = 0
                    max_speed = 0
                    max_positiveness = 0
                    max_stamina = 0
                    
                    for quarter_cross in quarter_crosses:
                        try:
                            # 쿼터 데이터 조회
                            quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
                            
                            # 삭제된 쿼터는 제외
                            if quarter.deleted_at is not None:
                                continue
                            
                            # 쿼터별 분석 데이터 조회
                            anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)
                            
                            # 6가지 지표 값 수집
                            quarter_total = anal_data.point_total or 0
                            quarter_sprint = anal_data.point_sprint or 0
                            quarter_acceleration = anal_data.point_acceleration or 0
                            quarter_speed = anal_data.point_speed or 0
                            quarter_positiveness = anal_data.point_positiveness or 0
                            quarter_stamina = anal_data.point_stamina or 0
                            
                            # 디버깅: 실제 값 출력
                            print(f"[DEBUG] Quarter {quarter.quarter_code}: total={quarter_total}, sprint={quarter_sprint}, acceleration={quarter_acceleration}, speed={quarter_speed}, positiveness={quarter_positiveness}, stamina={quarter_stamina}")
                            
                            # 각 경기별 최고값 갱신
                            max_total = max(max_total, quarter_total)
                            max_sprint = max(max_sprint, quarter_sprint)
                            max_acceleration = max(max_acceleration, quarter_acceleration)
                            max_speed = max(max_speed, quarter_speed)
                            max_positiveness = max(max_positiveness, quarter_positiveness)
                            max_stamina = max(max_stamina, quarter_stamina)
                            
                        except (PlayerQuarter.DoesNotExist, PlayerAnal.DoesNotExist):
                            continue
                    
                    # 각 경기의 최고 쿼터 점수들을 리스트에 추가
                    match_max_totals.append(max_total)
                    match_max_sprints.append(max_sprint)
                    match_max_accelerations.append(max_acceleration)
                    match_max_speeds.append(max_speed)
                    match_max_positivenesses.append(max_positiveness)
                    match_max_staminas.append(max_stamina)
                            
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
                
                # 디버깅: 계산된 평균값 출력
                print(f"[DEBUG] Calculated averages: OVR={ovr}, sprint={avg_sprint}, acceleration={avg_acceleration}, speed={avg_speed}, positiveness={avg_positiveness}, stamina={avg_stamina}")
                print(f"[DEBUG] Match max totals: {match_max_totals}")
                print(f"[DEBUG] Match max sprints: {match_max_sprints}")
                
            else:
                # 데이터가 없는 경우 모든 지표 0으로 설정
                ovr = 0
                avg_sprint = 0
                avg_acceleration = 0
                avg_speed = 0
                avg_positiveness = 0
                avg_stamina = 0
                print("[DEBUG] No match data found, setting all values to 0")
            
            # 각 경기의 쿼터 중 최대값으로 미니 차트 데이터 구성
            match_max_point_totals = []  # 각 경기별 최대 평점
            match_max_distances = []     # 각 경기별 최대 이동거리 (km)
            match_max_speeds = []        # 각 경기별 최대 속도 (km/h)
            match_max_sprints = []       # 각 경기별 최대 스프린트 횟수
            match_dates = []             # 날짜 정보 추가
            for match in player_matches:
                try:
                    quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match.match_code, deleted_at__isnull=True)
                    max_total = 0
                    max_distance = 0.0
                    max_speed = 0.0
                    max_sprint = 0

                    for quarter_cross in quarter_crosses:
                        try:
                            quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
                            
                            # 삭제된 쿼터는 제외
                            if quarter.deleted_at is not None:
                                continue
                                
                            anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)

                            # 최대값 갱신 (쿼터 단위)
                            quarter_total_value = int(anal_data.point_total or 0)
                            max_total = max(max_total, quarter_total_value)
                            if anal_data.T_D is not None:
                                max_distance = max(max_distance, float(anal_data.T_D))  # km
                            if anal_data.T_HS is not None:
                                max_speed = max(max_speed, float(anal_data.T_HS))      # km/h
                            quarter_sprint_value = int(anal_data.point_sprint or 0)
                            max_sprint = max(max_sprint, int(anal_data.T_S or 0))
                            
                            # 디버그용 전체 쿼터 데이터 수집
                            all_quarter_totals.append(quarter_total_value)
                            all_quarter_sprints.append(quarter_sprint_value)
                        except (PlayerQuarter.DoesNotExist, PlayerAnal.DoesNotExist):
                            continue

                    match_max_point_totals.append(int(max_total))
                    # 소수 2째자리까지 유지 (프론트에서 toFixed(2) 적용)
                    match_max_distances.append(round(max_distance, 2))
                    match_max_speeds.append(round(max_speed))
                    match_max_sprints.append(int(max_sprint))
                    
                    # 디버깅: 각 경기별 최대값 출력
                    print(f"[DEBUG] Match {match.match_code}: max_total={max_total}, max_distance={max_distance}, max_speed={max_speed}, max_sprint={max_sprint}")
                    
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
            while len(match_max_point_totals) < 5:
                match_max_point_totals.append(0)
            while len(match_max_distances) < 5:
                match_max_distances.append(0)
            while len(match_max_speeds) < 5:
                match_max_speeds.append(0)
            while len(match_max_sprints) < 5:
                match_max_sprints.append(0)
            while len(match_dates) < 5:
                match_dates.append(None)

            # 최신 경기가 마지막에 오도록 순서 뒤집기 (그래프 및 현재값 표시 일관성)
            match_max_point_totals = list(reversed(match_max_point_totals[:5]))
            match_max_distances = list(reversed(match_max_distances[:5]))
            match_max_speeds = list(reversed(match_max_speeds[:5]))
            match_max_sprints = list(reversed(match_max_sprints[:5]))
            match_dates = list(reversed(match_dates[:5]))
            
            # 디버깅: 최종 결과 출력
            print(f"[DEBUG] Final radar data: OVR={ovr}, sprint={avg_sprint}, acceleration={avg_acceleration}, speed={avg_speed}, positiveness={avg_positiveness}, stamina={avg_stamina}")
            print(f"[DEBUG] Final mini chart data: point_total={match_max_point_totals}")

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


class GetUserStatsDataView(APIView):
    """
    사용자 통계 데이터 조회
    """
    def get(self, request):
        user_code = request.query_params.get('user_code')
        
        if not user_code:
            return Response({"error": "user_code parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 플레이어 매치 데이터 조회
            player_matches = PlayerMatchCross.objects.filter(user_code=user_code)
            matches_count = player_matches.count()
            
            if matches_count == 0:
                return Response({
                    "total": 0,
                    "sprint": 0,
                    "acceleration": 0,
                    "speed": 0,
                    "positiveness": 0,
                    "stamina": 0,
                    "matches_count": 0
                })
            
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


class GetUserPointDataView(APIView):
    """
    사용자 포인트 데이터 조회
    """
    def get(self, request):
        user_code = request.query_params.get('user_code')
        
        if not user_code:
            return Response({"error": "user_code parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 플레이어 매치 데이터 조회
            player_matches = PlayerMatchCross.objects.filter(user_code=user_code)
            matches_count = player_matches.count()
            
            if matches_count == 0:
                return Response({
                    "point_total": 0,
                    "point_sprint": 0,
                    "point_acceleration": 0,
                    "point_speed": 0,
                    "point_positiveness": 0,
                    "point_stamina": 0,
                    "matches_count": 0
                })
            
            # 포인트 데이터 생성 (실제 데이터가 없으면 0)
            point_data = {
                "point_total": 0,
                "point_sprint": 0,
                "point_acceleration": 0,
                "point_speed": 0,
                "point_positiveness": 0,
                "point_stamina": 0,
                "matches_count": matches_count
            }
            
            return Response(point_data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetMatchDetailView(APIView):
    """
    특정 경기의 상세 분석 데이터 조회
    """
    
    @swagger_auto_schema(
        operation_description="특정 경기의 상세 분석 데이터를 조회합니다.",
        responses={200: "성공", 400: "잘못된 요청", 404: "경기를 찾을 수 없음", 500: "서버 오류"}
    )
    def get(self, request):
        user_code = request.query_params.get('user_code')
        match_code = request.query_params.get('match_code')
        
        if not user_code or not match_code:
            return Response(
                {"error": "user_code and match_code parameters are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 경기 정보 확인
            try:
                match = PlayerMatch.objects.get(match_code=match_code)
            except PlayerMatch.DoesNotExist:
                return Response(
                    {"success": False, "error": "경기를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 사용자가 해당 경기에 참여했는지 확인
            user_participation = PlayerMatchCross.objects.filter(
                user_code=user_code, 
                match_code=match_code,
                deleted_at__isnull=True
            ).exists()
            
            if not user_participation:
                return Response(
                    {"success": False, "error": "해당 경기에 참여하지 않았습니다."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # 경기의 쿼터 정보 조회 (삭제되지 않은 것만)
            quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match_code, deleted_at__isnull=True)
            quarters_data = []
            total_distance = 0
            max_speed = 0
            total_duration = 0
            total_points = 0
            
            for quarter_cross in quarter_crosses:
                try:
                    quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
                    
                    # 삭제된 쿼터는 제외
                    if quarter.deleted_at is not None:
                        continue
                    
                    # 해당 쿼터의 분석 데이터 조회
                    try:
                        anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)
                        quarter_points = float(anal_data.point_total) if anal_data.point_total else 0.0
                        quarter_distance = float(anal_data.T_D) if anal_data.T_D else 0.0  # T_D = Total Distance
                        quarter_max_speed = float(anal_data.T_HS) if anal_data.T_HS else 0.0  # T_HS = Total High Speed
                        quarter_anal_time = float(anal_data.T_T) if anal_data.T_T else 0.0  # T_T = Total Time (분)
                        quarter_sprint_count = int(anal_data.T_S) if anal_data.T_S else 0  # T_S = Sprint Count
                        
                        # 레이더 차트용 점수들
                        point_stamina = int(anal_data.point_stamina) if anal_data.point_stamina else 0  # 체력
                        point_positiveness = int(anal_data.point_positiveness) if anal_data.point_positiveness else 0  # 순발력
                        point_speed = int(anal_data.point_speed) if anal_data.point_speed else 0  # 스피드
                        point_acceleration = int(anal_data.point_acceleration) if anal_data.point_acceleration else 0  # 가속도
                        point_sprint = int(anal_data.point_sprint) if anal_data.point_sprint else 0  # 스프린트
                        
                    except (PlayerAnal.DoesNotExist, ValueError, TypeError):
                        quarter_points = 0.0
                        quarter_distance = 0.0
                        quarter_max_speed = 0.0
                        quarter_anal_time = 0.0
                        quarter_sprint_count = 0
                        point_stamina = 0
                        point_positiveness = 0
                        point_speed = 0
                        point_acceleration = 0
                        point_sprint = 0
                    
                    # 쿼터 시간 계산 (분석 데이터의 실제 이동시간 우선 사용)
                    try:
                        if quarter_anal_time > 0:
                            # 분석 데이터에서 실제 이동시간 사용 (더 정확)
                            duration = quarter_anal_time
                        elif quarter.start_time and quarter.end_time:
                            # 분석 데이터가 없으면 쿼터 시작/종료 시간으로 계산
                            duration = (quarter.end_time - quarter.start_time).total_seconds() / 60
                        else:
                            duration = 0.0
                    except Exception:
                        duration = 0.0
                    
                    # 시간 포맷팅 (PlayerQuarter 테이블의 start_time, end_time 사용)
                    try:
                        start_time_str = quarter.start_time.isoformat() if quarter.start_time else None
                        end_time_str = quarter.end_time.isoformat() if quarter.end_time else None
                    except Exception:
                        start_time_str = None
                        end_time_str = None
                    
                    quarters_data.append({
                        "quarter_code": quarter.quarter_code,
                        "quarter": len(quarters_data) + 1,  # 쿼터 순서 번호
                        "name": quarter.name or f"{len(quarters_data) + 1}쿼터",  # DB의 실제 이름 사용
                        "start_time": start_time_str,
                        "end_time": end_time_str,
                        "duration": round(duration, 1),
                        "actual_move_time": round(quarter_anal_time, 1),  # 실제 이동시간
                        "points": quarter_points,
                        "distance": quarter_distance,
                        "max_speed": quarter_max_speed,
                        "sprint_count": quarter_sprint_count,  # T_S 스프린트 횟수
                        "status": "완료",
                        # 레이더 차트용 세부 점수들
                        "radar_scores": {
                            "stamina": point_stamina,      # 체력
                            "positiveness": point_positiveness,  # 순발력
                            "speed": point_speed,          # 스피드
                            "acceleration": point_acceleration,  # 가속도
                            "sprint": point_sprint         # 스프린트
                        }
                    })
                    
                    # 총합 계산
                    total_distance += quarter_distance
                    max_speed = max(max_speed, quarter_max_speed)
                    total_duration += duration
                    total_points += quarter_points
                    
                except PlayerQuarter.DoesNotExist:
                    continue
            
            # AI 요약 생성 (PlayerAi 테이블에서 가져오기)
            try:
                from DB.models import PlayerAi
                try:
                    player_ai = PlayerAi.objects.get(match_code=match_code)
                    if player_ai.answer:
                        # JSON 형태의 answer 필드에서 feedback_list 추출
                        if isinstance(player_ai.answer, dict) and 'feedback_list' in player_ai.answer:
                            ai_summary = player_ai.answer['feedback_list']
                        elif isinstance(player_ai.answer, list):
                            ai_summary = player_ai.answer
                        elif isinstance(player_ai.answer, str):
                            ai_summary = [player_ai.answer]
                        else:
                            ai_summary = [
                                f"총 {len(quarters_data)}개 쿼터에서 {total_points:.0f}점을 획득했습니다.",
                                f"최고 속도 {max_speed:.1f}km/h로 우수한 스피드를 보였습니다.",
                                f"총 이동거리 {total_distance:.2f}km로 활발한 움직임을 보였습니다."
                            ]
                    else:
                        ai_summary = [
                            f"총 {len(quarters_data)}개 쿼터에서 {total_points:.0f}점을 획득했습니다.",
                            f"최고 속도 {max_speed:.1f}km/h로 우수한 스피드를 보였습니다.",
                            f"총 이동거리 {total_distance:.2f}km로 활발한 움직임을 보였습니다."
                        ]
                except PlayerAi.DoesNotExist:
                    ai_summary = [
                        f"총 {len(quarters_data)}개 쿼터에서 {total_points:.0f}점을 획득했습니다.",
                        f"최고 속도 {max_speed:.1f}km/h로 우수한 스피드를 보였습니다.",
                        f"총 이동거리 {total_distance:.2f}km로 활발한 움직임을 보였습니다."
                    ]
            except Exception as e:
                print(f"AI 요약 생성 중 오류: {str(e)}")
                ai_summary = [
                    "경기 분석이 완료되었습니다.",
                    "상세한 분석 결과를 확인해보세요.",
                    "더 나은 성과를 위해 노력해주세요."
                ]
            
            # 경기장 정보 가져오기
            try:
                from DB.models import GroundInfo
                try:
                    ground = GroundInfo.objects.get(ground_code=match.ground_code)
                    ground_name = ground.name
                except GroundInfo.DoesNotExist:
                    ground_name = "경기장 정보"
            except Exception:
                ground_name = "경기장 정보"
            
            # 사용자 정보 가져오기
            try:
                user_info = UserInfo.objects.get(user_code=user_code)
                user_name = user_info.name
                user_position = user_info.preferred_position or "포지션 미설정"
            except UserInfo.DoesNotExist:
                user_name = "사용자"
                user_position = "포지션 미설정"
            
            # 경기 정보 포맷팅
            if match.start_time:
                try:
                    from django.utils import timezone
                    if timezone.is_aware(match.start_time):
                        local_dt = timezone.localtime(match.start_time)
                    else:
                        local_dt = match.start_time
                    match_date = local_dt.strftime('%Y.%m.%d')
                    match_time = local_dt.strftime('%H:%M')
                except Exception:
                    match_date = match.start_time.strftime('%Y.%m.%d')
                    match_time = match.start_time.strftime('%H:%M')
            else:
                match_date = '날짜 미정'
                match_time = ''
            
            try:
                match_detail = {
                    "user_info": {
                        "user_name": user_name,
                        "user_position": user_position
                    },
                    "match_info": {
                        "match_code": match.match_code,
                        "name": match.name or f"{match_date} 경기",
                        "date": match_date,
                        "time": match_time,
                        "ground_name": ground_name
                    },
                    "match_stats": {
                        "total_duration_minutes": round(total_duration, 1),
                        "quarter_count": len(quarters_data),
                        "max_speed": max_speed,
                        "total_distance": total_distance,
                        "total_points": total_points
                    },
                    "quarters": quarters_data,
                    "ai_summary": ai_summary,
                    "debug_info": {
                        "ai_data_exists": bool(player_ai.answer if 'player_ai' in locals() else False),
                        "ai_data_type": type(player_ai.answer).__name__ if 'player_ai' in locals() and player_ai.answer else None
                    }
                }
                
                return Response({
                    "success": True,
                    "data": match_detail
                })
            except Exception as e:
                return Response({
                    "success": False,
                    "error": f"데이터 처리 중 오류가 발생했습니다: {str(e)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            return Response(
                {"error": f"서버 오류: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetUserPlayerMatchesView(APIView):
    """
    사용자 개인 경기 목록 조회
    - PlayerMatch.start_time 기준 내림차순 정렬
    - 기본 20개, 최대 50개까지 반환
    - deleted_at 조건 문제 해결
    """
    
    @swagger_auto_schema(
        operation_description="사용자의 경기 목록을 조회합니다.",
        responses={200: "성공", 400: "잘못된 요청", 500: "서버 오류"}
    )
    def get(self, request):
        user_code = request.query_params.get('user_code')
        limit_param = request.query_params.get('limit')

        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            limit = 20
            if limit_param is not None:
                try:
                    limit = max(1, min(50, int(limit_param)))
                except Exception:
                    limit = 20

            # PlayerMatchCross에서 사용자의 match_code 수집
            player_match_crosses = PlayerMatchCross.objects.filter(
                user_code=user_code, 
                deleted_at__isnull=True
            ).values_list('match_code', flat=True).distinct()
            
            match_codes = list(player_match_crosses)

            if not match_codes:
                return Response({
                    "count": 0, 
                    "matches": [],
                    "message": "참여한 경기가 없습니다."
                })

            # PlayerMatch에서 실제 경기 정보 조회
            matches_qs = (
                PlayerMatch.objects.filter(
                    match_code__in=match_codes
                )
                .order_by('-start_time')[:limit]
            )
            
            matches_count = matches_qs.count()

            if matches_count == 0:
                return Response({
                    "count": 0,
                    "matches": [],
                    "message": "경기 정보를 찾을 수 없습니다."
                })

            # 경기 데이터 처리
            results = []
            for m in matches_qs:
                # 해당 경기의 쿼터 수 계산
                quarter_count = PlayerMatchQuarterCross.objects.filter(
                    match_code=m.match_code
                ).count()
                
                # 날짜/시간 포맷팅
                if m.start_time:
                    try:
                        dt = m.start_time
                        local_dt = timezone.localtime(dt) if timezone.is_aware(dt) else dt
                        date_str = local_dt.strftime('%Y.%m.%d')
                        time_str = local_dt.strftime('%H:%M')
                    except Exception:
                        date_str = '날짜 미정'
                        time_str = ''
                else:
                    date_str = '날짜 미정'
                    time_str = ''
                
                # 경기명 개선
                match_title = m.name if m.name and m.name.strip() else f'{date_str} 경기'

                results.append({
                    'match_code': m.match_code,
                    'title': match_title,
                    'date': date_str,
                    'time': time_str,
                    'quarter_count': quarter_count,
                    'start_time_iso': m.start_time.isoformat() if m.start_time else None,
                })

            return Response({
                'count': len(results),
                'matches': results,
                'user_code': user_code
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdatePlayerMatchNameView(APIView):
    """경기 이름 수정 API"""
    
    @swagger_auto_schema(
        operation_description="경기 이름을 수정합니다.",
        responses={
            200: openapi.Response(description="성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="경기를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        try:
            user_code = request.data.get('user_code')
            match_code = request.data.get('match_code')
            new_name = request.data.get('new_name', '').strip()

            if not user_code or not match_code:
                return Response(
                    {"error": "user_code와 match_code가 필요합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not new_name:
                return Response(
                    {"error": "새로운 이름이 필요합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 사용자가 해당 경기에 참여했는지 확인
            user_match = PlayerMatchCross.objects.filter(
                user_code=user_code,
                match_code=match_code,
                deleted_at__isnull=True
            ).first()

            if not user_match:
                return Response(
                    {"error": "해당 경기를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # 경기 이름 수정
            match = PlayerMatch.objects.filter(match_code=match_code).first()
            if match:
                match.name = new_name
                match.save()
                
                return Response({
                    "success": True,
                    "message": "경기 이름이 수정되었습니다.",
                    "match_code": match_code,
                    "new_name": new_name
                })
            else:
                return Response(
                    {"error": "경기를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeletePlayerMatchView(APIView):
    """경기 삭제 API (소프트 삭제)"""
    
    @swagger_auto_schema(
        operation_description="경기를 삭제합니다 (소프트 삭제).",
        responses={
            200: openapi.Response(description="성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="경기를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        try:
            user_code = request.data.get('user_code')
            match_code = request.data.get('match_code')

            if not user_code or not match_code:
                return Response(
                    {"error": "user_code와 match_code가 필요합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 사용자가 해당 경기에 참여했는지 확인
            user_match = PlayerMatchCross.objects.filter(
                user_code=user_code,
                match_code=match_code,
                deleted_at__isnull=True
            ).first()

            if not user_match:
                return Response(
                    {"error": "해당 경기를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # 소프트 삭제 (deleted_at 설정)
            user_match.deleted_at = timezone.now()
            user_match.save()
            
            return Response({
                "success": True,
                "message": "경기가 삭제되었습니다.",
                "match_code": match_code
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateQuarterNameView(APIView):
    """쿼터 이름 변경 API"""
    
    @swagger_auto_schema(
        operation_description="쿼터 이름을 변경합니다.",
        responses={
            200: openapi.Response(description="성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="쿼터를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        try:
            user_code = request.data.get('user_code')
            match_code = request.data.get('match_code')
            quarter_number = request.data.get('quarter_number')
            new_name = request.data.get('new_name')

            if not all([user_code, match_code, quarter_number, new_name]):
                return Response(
                    {"error": "user_code, match_code, quarter_number, new_name이 모두 필요합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 매치-쿼터 관계를 통해 쿼터 찾기 (삭제되지 않은 쿼터만)
            quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match_code, deleted_at__isnull=True).order_by('id')
            active_quarters = []
            
            # 삭제되지 않은 쿼터만 필터링
            for quarter_cross in quarter_crosses:
                try:
                    quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
                    if quarter.deleted_at is None:  # 삭제되지 않은 쿼터만
                        active_quarters.append(quarter)
                except PlayerQuarter.DoesNotExist:
                    continue
            
            # quarter_number에 해당하는 쿼터 찾기 (1-based index)
            quarter_index = int(quarter_number) - 1
            target_quarter = None
            if quarter_index < len(active_quarters):
                target_quarter = active_quarters[quarter_index]

            if not target_quarter:
                return Response(
                    {"error": f"해당 쿼터({quarter_number}번째)를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # 쿼터 이름 업데이트
            target_quarter.name = new_name
            target_quarter.save()
            
            return Response({
                "success": True,
                "message": "쿼터 이름이 변경되었습니다.",
                "quarter_number": quarter_number,
                "quarter_code": target_quarter.quarter_code,
                "new_name": new_name
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteQuarterView(APIView):
    """쿼터 삭제 API"""
    
    @swagger_auto_schema(
        operation_description="쿼터를 삭제합니다.",
        responses={
            200: openapi.Response(description="성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="쿼터를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        try:
            user_code = request.data.get('user_code')
            match_code = request.data.get('match_code')
            quarter_number = request.data.get('quarter_number')

            if not all([user_code, match_code, quarter_number]):
                return Response(
                    {"error": "user_code, match_code, quarter_number가 모두 필요합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 매치-쿼터 관계를 통해 쿼터 찾기 (삭제되지 않은 쿼터만)
            quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match_code, deleted_at__isnull=True).order_by('id')
            active_quarters = []
            active_quarter_crosses = []
            
            # 삭제되지 않은 쿼터만 필터링
            for quarter_cross in quarter_crosses:
                try:
                    quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
                    if quarter.deleted_at is None:  # 삭제되지 않은 쿼터만
                        active_quarters.append(quarter)
                        active_quarter_crosses.append(quarter_cross)
                except PlayerQuarter.DoesNotExist:
                    continue
            
            # quarter_number에 해당하는 쿼터 찾기 (1-based index)
            quarter_index = int(quarter_number) - 1
            target_quarter = None
            target_quarter_cross = None
            if quarter_index < len(active_quarters):
                target_quarter = active_quarters[quarter_index]
                target_quarter_cross = active_quarter_crosses[quarter_index]

            if not target_quarter or not target_quarter_cross:
                return Response(
                    {"error": f"해당 쿼터({quarter_number}번째)를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # Soft delete: deleted_at 필드에 현재 시간 설정
            from django.utils import timezone
            target_quarter.deleted_at = timezone.now()
            target_quarter.save()
            
            # 관계 테이블에서도 soft delete 적용
            target_quarter_cross.deleted_at = timezone.now()
            target_quarter_cross.save()
            
            return Response({
                "success": True,
                "message": "쿼터가 삭제되었습니다.",
                "quarter_number": quarter_number,
                "quarter_code": target_quarter.quarter_code
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


