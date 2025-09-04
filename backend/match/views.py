from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from django.db.models import Avg, Count, Sum
from django.utils import timezone
from datetime import datetime
import json
import io

# 명시적 모델 임포트
from DB.models import (
    PlayerMatch, PlayerMatchCross, PlayerQuarter, 
    PlayerMatchQuarterCross, GroundInfo, PlayerAi, PlayerAnal
)

from staticfiles.file_uploader import S3FileUploader
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# =============================== match 관련 ===============================
# 경기 상세 정보 조회
class Get_Match_Info_From_Player(APIView):
    """
    특정 매치의 상세 정보 조회
    - 경기 장소 (GroundInfo)
    - 경기 시간 (모든 쿼터 시작, 종료 시간의 합)
    - 경기 수 (쿼터수)
    - 최고속력 (해당 경기 쿼터 정보들 중에 최고 속력)
    - 이동거리 (각 쿼터 이동거리의 합)
    - AI 요약 (PlayerAi)
    """
    
    @swagger_auto_schema(
        operation_summary="매치 상세 정보 조회",
        operation_description="특정 매치의 상세 정보를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'match_code',
                openapi.IN_QUERY,
                description='매치 코드',
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description='사용자 코드 (선택사항)',
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        responses={
            200: openapi.Response(description="매치 상세 정보 조회 성공"),
            404: openapi.Response(description="매치를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        try:
            match_code = request.query_params.get('match_code')
            user_code = request.query_params.get('user_code')  # 사용자 정보 조회용 (선택적)
            
            if not match_code:
                return Response({"error": "match_code가 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)
            
            # 매치 정보 조회
            try:
                match = PlayerMatch.objects.get(match_code=match_code)
            except PlayerMatch.DoesNotExist:
                return Response({"error": "매치를 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)
            
            # 그라운드 정보 조회
            try:
                ground = GroundInfo.objects.get(ground_code=match.ground_code)
                ground_name = ground.name
                ground_address = ground.address
            except GroundInfo.DoesNotExist:
                ground_name = "알 수 없는 경기장"
                ground_address = "알 수 없는 주소"
            
            # 매치의 쿼터 정보 조회
            quarter_crosses = PlayerMatchQuarterCross.objects.filter(match_code=match_code)
            quarters = []
            total_duration_minutes = 0
            max_speed = 0
            total_distance = 0
            
            for quarter_cross in quarter_crosses:
                try:
                    quarter = PlayerQuarter.objects.get(quarter_code=quarter_cross.quarter_code)
                    quarters.append(quarter)
                    
                    # 쿼터 시간 계산 (분 단위)
                    duration = (quarter.end_time - quarter.start_time).total_seconds() / 60
                    total_duration_minutes += duration
                    
                    # 분석 데이터 조회
                    try:
                        anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)
                        # 최고속력 업데이트
                        if anal_data.T_HS and anal_data.T_HS > max_speed:
                            max_speed = float(anal_data.T_HS)
                        # 이동거리 합계
                        if anal_data.T_D:
                            total_distance += float(anal_data.T_D)
                    except PlayerAnal.DoesNotExist:
                        continue
                        
                except PlayerQuarter.DoesNotExist:
                    continue
            
            # AI 요약 조회
            ai_summary = None
            try:
                player_ai = PlayerAi.objects.get(match_code=match_code)
                if player_ai.answer:
                    # JSON 데이터가 있으면 파싱해서 feedback_list를 포함한 형태로 반환
                    if isinstance(player_ai.answer, dict):
                        ai_summary = player_ai.answer
                    else:
                        # 문자열인 경우 기본 구조로 감싸기
                        ai_summary = {
                            "feedback_list": [str(player_ai.answer)]
                        }
                else:
                    ai_summary = {
                        "feedback_list": ["AI 분석이 아직 완료되지 않았습니다."]
                    }
            except PlayerAi.DoesNotExist:
                ai_summary = {
                    "feedback_list": ["AI 분석이 아직 완료되지 않았습니다."]
                }
            
            # 사용자 정보 조회 (user_code가 제공된 경우)
            user_info = None
            if user_code:
                try:
                    from DB.models import UserInfo
                    user_info_obj = UserInfo.objects.get(user_code=user_code)
                    user_info = {
                        "user_name": user_info_obj.name,
                        "user_position": user_info_obj.preferred_position,
                        "user_level": user_info_obj.level,
                        "user_type": user_info_obj.user_type
                    }
                except UserInfo.DoesNotExist:
                    user_info = None
            
            # 응답 데이터 구성
            response_data = {
                "match_info": {
                    "match_code": match_code,
                    "match_name": match.name,
                    "ground_name": ground_name,
                    "ground_address": ground_address,
                    "start_time": match.start_time,
                    "end_time": match.end_time
                },
                "match_stats": {
                    "total_duration_minutes": round(total_duration_minutes, 1),
                    "quarter_count": len(quarters),
                    "max_speed": round(max_speed, 1),
                    "total_distance": round(total_distance, 2)
                },
                "quarters": [
                    {
                        "quarter_code": q.quarter_code,
                        "name": q.name,
                        "start_time": q.start_time,
                        "end_time": q.end_time,
                        "status": q.status,
                        "duration_minutes": round((q.end_time - q.start_time).total_seconds() / 60, 1) if q.end_time and q.start_time else 0,
                        # 쿼터별 분석 데이터 추가
                        **self._get_quarter_analysis_data(q.quarter_code)
                    } for q in quarters
                ],
                "ai_summary": ai_summary,
                "user_info": user_info  # 사용자 정보 추가
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_quarter_analysis_data(self, quarter_code):
        """쿼터별 분석 데이터를 가져오는 헬퍼 메서드"""
        try:
            from DB.models import PlayerAnal
            anal_data = PlayerAnal.objects.get(quarter_code=quarter_code)
            
            return {
                "points": int(anal_data.point_total) if anal_data.point_total is not None else 0,
                "distance": float(anal_data.T_D) if anal_data.T_D is not None else 0.0,
                "max_speed": float(anal_data.T_HS) if anal_data.T_HS is not None else 0.0,
                "avg_speed": float(anal_data.T_AS) if anal_data.T_AS is not None else 0.0,
                "sprint_count": int(anal_data.T_S) if anal_data.T_S is not None else 0,
                "movement_ratio": float(anal_data.T_MR) if anal_data.T_MR is not None else 0.0
            }
        except PlayerAnal.DoesNotExist:
            print(f"❌ PlayerAnal 데이터가 존재하지 않음: {quarter_code}")
            return {
                "points": 0,
                "distance": 0.0,
                "max_speed": 0.0,
                "avg_speed": 0.0,
                "sprint_count": 0,
                "movement_ratio": 0.0
            }
        except Exception as e:
            print(f"❌ 쿼터 분석 데이터 처리 오류: {quarter_code}, 오류: {e}")
            return {
                "points": 0,
                "distance": 0.0,
                "max_speed": 0.0,
                "avg_speed": 0.0,
                "sprint_count": 0,
                "movement_ratio": 0.0
            }


# 경기 이름 수정
class Update_MatchName_From_Player(APIView):
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


# 경기 삭제
class Delete_Match_From_Player(APIView):
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


# =============================== quarter 관련 ===============================
# 쿼터 이름 수정
class Update_QuarterName_From_Player(APIView):
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


# 쿼터 삭제
class Delete_Quarter_From_Player(APIView):
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


# 사용자별 경기 목록 조회
class Get_User_Matches_From_Player(APIView):
    """
    사용자가 참여한 경기 목록 조회
    - 사용자가 참여한 모든 경기 정보
    - 경기장 정보, 경기 통계 포함
    - 삭제되지 않은 경기만 조회
    """
    
    @swagger_auto_schema(
        operation_summary="사용자 경기 목록 조회",
        operation_description="사용자가 참여한 경기 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description='사용자 코드',
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="경기 목록 조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        try:
            user_code = request.query_params.get('user_code')
            if not user_code:
                return Response({"error": "user_code가 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)
            
            # 사용자가 참여한 경기 목록 조회 (삭제되지 않은 경기만)
            user_match_crosses = PlayerMatchCross.objects.filter(
                user_code=user_code,
                deleted_at__isnull=True
            ).select_related()
            
            matches_data = []
            
            for user_match_cross in user_match_crosses:
                try:
                    # 경기 정보 조회
                    match = PlayerMatch.objects.get(
                        match_code=user_match_cross.match_code,
                        deleted_at__isnull=True
                    )
                    
                    # 경기장 정보 조회
                    try:
                        ground = GroundInfo.objects.get(ground_code=match.ground_code)
                        ground_name = ground.name
                        ground_address = ground.address
                    except GroundInfo.DoesNotExist:
                        ground_name = "알 수 없는 경기장"
                        ground_address = "알 수 없는 주소"
                    
                    # 경기의 쿼터 정보 조회 (삭제되지 않은 쿼터만)
                    quarter_crosses = PlayerMatchQuarterCross.objects.filter(
                        match_code=match.match_code,
                        deleted_at__isnull=True
                    )
                    
                    quarter_count = 0
                    total_duration_minutes = 0
                    max_speed = 0
                    total_distance = 0
                    
                    for quarter_cross in quarter_crosses:
                        try:
                            quarter = PlayerQuarter.objects.get(
                                quarter_code=quarter_cross.quarter_code,
                                deleted_at__isnull=True
                            )
                            quarter_count += 1
                            
                            # 쿼터 시간 계산 (분 단위)
                            if quarter.start_time and quarter.end_time:
                                duration = (quarter.end_time - quarter.start_time).total_seconds() / 60
                                total_duration_minutes += duration
                            
                            # 분석 데이터 조회
                            try:
                                anal_data = PlayerAnal.objects.get(quarter_code=quarter.quarter_code)
                                # 최고속력 업데이트
                                if anal_data.T_HS and float(anal_data.T_HS) > max_speed:
                                    max_speed = float(anal_data.T_HS)
                                # 이동거리 합계
                                if anal_data.T_D:
                                    total_distance += float(anal_data.T_D)
                            except PlayerAnal.DoesNotExist:
                                continue
                                
                        except PlayerQuarter.DoesNotExist:
                            continue
                    
                    # 경기 데이터 구성
                    match_data = {
                        "match_code": match.match_code,
                        "match_name": match.name,
                        "match_date": match.start_time.strftime('%Y-%m-%d') if match.start_time else '',
                        "match_time": match.start_time.strftime('%H:%M') if match.start_time else '',
                        "ground_name": ground_name,
                        "ground_address": ground_address,
                        "quarter_count": quarter_count,
                        "total_duration_minutes": round(total_duration_minutes, 1),
                        "max_speed": round(max_speed, 1),
                        "total_distance": round(total_distance, 2),
                        "start_time": match.start_time,
                        "end_time": match.end_time,
                        "created_at": user_match_cross.created_at
                    }
                    
                    matches_data.append(match_data)
                    
                except PlayerMatch.DoesNotExist:
                    # 경기가 삭제된 경우 건너뛰기
                    continue
            
            # 최신순으로 정렬 (created_at 기준)
            matches_data.sort(key=lambda x: x['created_at'], reverse=True)
            
            # created_at은 응답에서 제거 (정렬용으로만 사용)
            for match in matches_data:
                del match['created_at']
            
            response_data = {
                "success": True,
                "matches": matches_data,
                "total_count": len(matches_data)
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

