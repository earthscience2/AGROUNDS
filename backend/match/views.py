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
    PlayerMatchQuarterCross, GroundInfo, PlayerAi, PlayerAnal,
    TeamQuarter, TeamAnal, TeamMatchQuarterCross, TeamAi, UserInfo,
    TeamPlayerAnal, TeamMatch, TeamMatchCross, PlayerTeamCross
)

from staticfiles.file_uploader import S3FileUploader
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# ===============================================
# 경기 관련 API
# ===============================================

class Get_Match_Info_From_Player(APIView):
    """
    경기 상세 정보 조회 API
    경기 장소, 경기 시간, 쿼터 수, 최고속력, 이동거리, AI 요약 등의 상세 정보를 조회합니다.
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
        """경기 상세 정보 조회"""
        match_code = request.query_params.get('match_code')
        user_code = request.query_params.get('user_code')
        
        if not match_code:
            return Response(
                {"error": "match_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            
            match = get_object_or_404(PlayerMatch, match_code=match_code)
            
            # 그라운드 정보 조회
            try:
                ground = GroundInfo.objects.get(ground_code=match.ground_code)
                ground_name = ground.name
                ground_address = ground.address
            except GroundInfo.DoesNotExist:
                ground_name = "알 수 없는 경기장"
                ground_address = "알 수 없는 주소"
            
            # 매치의 쿼터 정보 조회 (삭제되지 않은 교차 데이터만 사용)
            quarter_crosses = PlayerMatchQuarterCross.objects.filter(
                match_code=match_code,
                deleted_at__isnull=True
            )
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
                        "home": q.home,
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


class Update_MatchName_From_Player(APIView):
    """
    경기 이름 수정 API
    특정 경기의 이름을 수정합니다.
    """
    
    @swagger_auto_schema(
        operation_description="경기 이름을 수정합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'match_code': openapi.Schema(type=openapi.TYPE_STRING, description='경기 코드'),
                'new_name': openapi.Schema(type=openapi.TYPE_STRING, description='새로운 경기 이름')
            },
            required=['user_code', 'match_code', 'new_name']
        ),
        responses={
            200: openapi.Response(description="수정 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="경기를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """경기 이름 수정"""
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
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "경기를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )

        except Exception as e:
            return Response(
                {"error": f"경기 이름 수정 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Delete_Match_From_Player(APIView):
    """
    경기 삭제 API
    경기를 삭제합니다 (소프트 삭제).
    """
    
    @swagger_auto_schema(
        operation_description="경기를 삭제합니다 (소프트 삭제).",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'match_code': openapi.Schema(type=openapi.TYPE_STRING, description='경기 코드')
            },
            required=['user_code', 'match_code']
        ),
        responses={
            200: openapi.Response(description="삭제 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="경기를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """경기 삭제 (소프트 삭제)"""
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
            current_time = timezone.now()
            user_match.deleted_at = current_time
            user_match.save()

            # 매치-쿼터 교차 테이블 소프트 삭제
            PlayerMatchQuarterCross.objects.filter(
                match_code=match_code,
                deleted_at__isnull=True
            ).update(deleted_at=current_time)
            
            return Response({
                "success": True,
                "message": "경기가 삭제되었습니다.",
                "match_code": match_code
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"경기 삭제 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ===============================================
# 쿼터 관련 API
# ===============================================

class Update_QuarterName_From_Player(APIView):
    """
    쿼터 이름 수정 API
    특정 쿼터의 이름을 수정합니다.
    """
    
    @swagger_auto_schema(
        operation_description="쿼터 이름을 변경합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'match_code': openapi.Schema(type=openapi.TYPE_STRING, description='경기 코드'),
                'quarter_number': openapi.Schema(type=openapi.TYPE_INTEGER, description='쿼터 번호'),
                'new_name': openapi.Schema(type=openapi.TYPE_STRING, description='새로운 쿼터 이름')
            },
            required=['user_code', 'match_code', 'quarter_number', 'new_name']
        ),
        responses={
            200: openapi.Response(description="수정 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="쿼터를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """쿼터 이름 수정"""
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
                    # deleted_at 필드가 있는 경우에만 체크 (모델에 필드가 없을 수 있음)
                    if not hasattr(quarter, 'deleted_at') or quarter.deleted_at is None:
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

            # 쿼터 이름 업데이트 (특정 필드만 업데이트)
            PlayerQuarter.objects.filter(quarter_code=target_quarter.quarter_code).update(name=new_name)
            
            return Response({
                "success": True,
                "message": "쿼터 이름이 변경되었습니다.",
                "quarter_number": quarter_number,
                "quarter_code": target_quarter.quarter_code,
                "new_name": new_name
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"쿼터 이름 수정 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Delete_Quarter_From_Player(APIView):
    """
    쿼터 삭제 API
    쿼터를 삭제합니다 (소프트 삭제).
    """
    
    @swagger_auto_schema(
        operation_description="쿼터를 삭제합니다 (소프트 삭제).",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_code': openapi.Schema(type=openapi.TYPE_STRING, description='사용자 코드'),
                'match_code': openapi.Schema(type=openapi.TYPE_STRING, description='경기 코드'),
                'quarter_number': openapi.Schema(type=openapi.TYPE_INTEGER, description='쿼터 번호')
            },
            required=['user_code', 'match_code', 'quarter_number']
        ),
        responses={
            200: openapi.Response(description="삭제 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="쿼터를 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """쿼터 삭제 (소프트 삭제)"""
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
                    # deleted_at 필드가 있는 경우에만 체크 (모델에 필드가 없을 수 있음)
                    if not hasattr(quarter, 'deleted_at') or quarter.deleted_at is None:
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

            # Soft delete: deleted_at 필드에 현재 시간 설정 (필드가 있는 경우에만)
            from django.utils import timezone
            if hasattr(target_quarter, 'deleted_at'):
                target_quarter.deleted_at = timezone.now()
                target_quarter.save()
            else:
                # deleted_at 필드가 없으면 실제 삭제는 불가능하므로 에러 반환
                return Response(
                    {"error": "쿼터 삭제 기능을 사용할 수 없습니다. (deleted_at 필드 없음)"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # 관계 테이블에서도 soft delete 적용
            target_quarter_cross.deleted_at = timezone.now()
            target_quarter_cross.save()
            
            return Response({
                "success": True,
                "message": "쿼터가 삭제되었습니다.",
                "quarter_number": quarter_number,
                "quarter_code": target_quarter.quarter_code
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"쿼터 삭제 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Get_User_Matches_From_Player(APIView):
    """
    사용자 경기 목록 조회 API
    사용자가 참여한 모든 경기 정보를 조회합니다 (경기장 정보, 경기 통계 포함).
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
                        match_code=user_match_cross.match_code
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
                                quarter_code=quarter_cross.quarter_code
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
                        "status": match.status,  # 경기 상태 추가
                        "created_at": user_match_cross.created_at
                    }
                    
                    matches_data.append(match_data)
                    
                except PlayerMatch.DoesNotExist:
                    # 경기가 삭제된 경우 건너뛰기
                    continue
            
            # 최신순으로 정렬 (created_at 기준)
            matches_data.sort(key=lambda x: x['created_at'], reverse=True)
            
            # created_at 값을 ISO 포맷 문자열로 변환
            for match in matches_data:
                created_at_value = match.get('created_at')
                match['created_at'] = (
                    created_at_value.isoformat()
                    if created_at_value
                    else None
                )
            
            response_data = {
                "success": True,
                "matches": matches_data,
                "total_count": len(matches_data)
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Get_User_Quarters_From_Player(APIView):
    """
    사용자 쿼터 목록 조회 API
    사용자가 참여한 모든 쿼터 정보를 조회합니다 (경기 정보, 쿼터 통계 포함).
    """
    
    @swagger_auto_schema(
        operation_summary="사용자 쿼터 목록 조회",
        operation_description="사용자가 참여한 쿼터 목록을 조회합니다.",
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
            200: openapi.Response(description="쿼터 목록 조회 성공"),
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
            ).values_list('match_code', flat=True)
            
            quarters_data = []
            
            # 각 경기의 쿼터 정보 조회
            for match_code in user_match_crosses:
                try:
                    # 경기 정보 조회
                    match = PlayerMatch.objects.get(
                        match_code=match_code
                    )
                    
                    # 경기장 정보 조회
                    try:
                        ground = GroundInfo.objects.get(ground_code=match.ground_code)
                        ground_name = ground.name
                    except GroundInfo.DoesNotExist:
                        ground_name = "알 수 없는 경기장"
                    
                    # 경기의 쿼터 정보 조회 (삭제되지 않은 쿼터만)
                    quarter_crosses = PlayerMatchQuarterCross.objects.filter(
                        match_code=match_code,
                        deleted_at__isnull=True
                    ).order_by('id')
                    
                    for quarter_cross in quarter_crosses:
                        try:
                            quarter = PlayerQuarter.objects.get(
                                quarter_code=quarter_cross.quarter_code
                            )
                            
                            # 쿼터 분석 데이터 조회
                            quarter_stats = self._get_quarter_analysis_data(quarter.quarter_code)
                            
                            # 쿼터 데이터 구성
                            quarter_data = {
                                "quarter_code": quarter.quarter_code,
                                "quarter_name": quarter.name,
                                "match_code": match_code,
                                "match_name": match.name,
                                "ground_name": ground_name,
                                "quarter_date": quarter.start_time.strftime('%Y-%m-%d') if quarter.start_time else '',
                                "quarter_time": quarter.start_time.strftime('%H:%M') if quarter.start_time else '',
                                "start_time": quarter.start_time,
                                "end_time": quarter.end_time,
                                "status": quarter.status,
                                "home": quarter.home,
                                "duration_minutes": round((quarter.end_time - quarter.start_time).total_seconds() / 60, 1) if quarter.end_time and quarter.start_time else 0,
                                **quarter_stats
                            }
                            
                            quarters_data.append(quarter_data)
                            
                        except PlayerQuarter.DoesNotExist:
                            continue
                            
                except PlayerMatch.DoesNotExist:
                    continue
            
            # 최신순으로 정렬 (start_time 기준)
            quarters_data.sort(key=lambda x: x['start_time'] if x['start_time'] else datetime.min.replace(tzinfo=timezone.utc), reverse=True)
            
            response_data = {
                "success": True,
                "quarters": quarters_data,
                "total_count": len(quarters_data)
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
            return {
                "points": 0,
                "distance": 0.0,
                "max_speed": 0.0,
                "avg_speed": 0.0,
                "sprint_count": 0,
                "movement_ratio": 0.0
            }
        except Exception as e:
            return {
                "points": 0,
                "distance": 0.0,
                "max_speed": 0.0,
                "avg_speed": 0.0,
                "sprint_count": 0,
                "movement_ratio": 0.0
            }


# ===============================================
# 팀 분석 관련 API
# ===============================================

class Get_TeamAiSummary(APIView):
    """
    팀 경기 AI 요약 조회 API
    특정 팀 경기의 AI 요약 정보를 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_summary="팀 경기 AI 요약 조회",
        operation_description="특정 팀 경기의 AI 요약 정보를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'match_code',
                openapi.IN_QUERY,
                description='경기 코드',
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="AI 요약 조회 성공",
                examples={
                    "application/json": {
                        "ai_summary": {
                            "key_points": [
                                {
                                    "quarter": "1쿼터",
                                    "label": "높은 공 점유율 유지",
                                    "insight": "전반전 동안 팀이 안정적인 패스플레이로 58%의 높은 점유율을 기록했습니다.",
                                    "value": "점유율 58% | 패스 성공률 85%"
                                }
                            ]
                        },
                        "created_at": "2025-01-15T10:30:00Z"
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        match_code = request.query_params.get('match_code')
        
        if not match_code:
            return Response(
                {"error": "match_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 팀 AI 요약 데이터 조회
            team_ai = TeamAi.objects.filter(match_code=match_code).first()
            
            if not team_ai:
                return Response({
                    "ai_summary": {
                        "key_points": []
                    },
                    "message": "AI 분석 데이터가 없습니다."
                })
            
            # AI 요약 데이터 파싱
            ai_summary = []
            if team_ai.answer:
                # JSON 형태의 답변을 파싱
                if isinstance(team_ai.answer, dict):
                    # key_points가 있는 경우
                    if 'key_points' in team_ai.answer:
                        ai_summary = team_ai.answer['key_points']
                    else:
                        # 전체 답변을 key_points로 사용
                        ai_summary = team_ai.answer
                elif isinstance(team_ai.answer, list):
                    ai_summary = team_ai.answer
            
            return Response({
                "ai_summary": {
                    "key_points": ai_summary
                },
                "created_at": team_ai.created_at.isoformat() if team_ai.created_at else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"팀 AI 요약 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Get_TeamAnalysisData(APIView):
    """
    팀 경기 분석 데이터 조회 API
    특정 팀 경기의 전체 분석 결과를 조회합니다 (모든 쿼터 분석 데이터 포함).
    """
    
    @swagger_auto_schema(
        operation_summary="팀 경기 분석 데이터 조회",
        operation_description="특정 팀 경기의 전체 분석 결과를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'match_code',
                openapi.IN_QUERY,
                description='경기 코드',
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description='사용자 코드 (선택사항, 제공 시 사용자 역할 정보 포함)',
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        responses={
            200: openapi.Response(
                description="팀 분석 데이터 조회 성공",
                examples={
                    "application/json": {
                        "quarters": [
                            {
                                "quarter": 1,
                                "quarter_code": "q_team_001",
                                "name": "1쿼터",
                                "duration_minutes": 45.0,
                                "distance": 52.8,
                                "max_speed": 27.2,
                                "avg_speed": 6.1,
                                "points": 85,
                                "radar_scores": {
                                    "attack": 88,
                                    "defense": 82,
                                    "stamina": 85,
                                    "organization": 90,
                                    "speed": 78,
                                    "balance": 86
                                }
                            }
                        ],
                        "match_stats": {
                            "total_duration_minutes": 90.0,
                            "quarter_count": 2,
                            "max_speed": 28.5,
                            "total_distance": 105.2
                        }
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        match_code = request.query_params.get('match_code')
        user_code = request.query_params.get('user_code')
        
        if not match_code:
            return Response(
                {"error": "match_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 사용자 역할 조회 (user_code가 제공된 경우)
            user_role = None
            if user_code:
                try:
                    # match_code로 team_code 찾기
                    team_match_cross = TeamMatchCross.objects.filter(
                        match_code=match_code,
                        deleted_at__isnull=True
                    ).first()
                    
                    if team_match_cross:
                        # 사용자의 팀 역할 조회
                        player_team = PlayerTeamCross.objects.filter(
                            team_code=team_match_cross.team_code,
                            user_code=user_code,
                            deleted_at__isnull=True
                        ).first()
                        
                        if player_team:
                            user_role = player_team.role or 'member'
                            print(f"✅ 사용자 역할 조회 성공 - user_code: {user_code}, role: {user_role}")
                except Exception as e:
                    print(f"❌ 사용자 역할 조회 실패: {e}")
            
            # 해당 경기의 모든 쿼터 조회
            quarter_crosses = TeamMatchQuarterCross.objects.filter(
                match_code=match_code, 
                deleted_at__isnull=True
            ).order_by('created_at')
            
            if not quarter_crosses.exists():
                return Response({
                    "quarters": [],
                    "match_stats": {
                        "total_duration_minutes": 0,
                        "quarter_count": 0,
                        "max_speed": 0,
                        "total_distance": 0
                    },
                    "message": "해당 경기의 분석 데이터가 없습니다."
                })
            
            quarters_data = []
            total_distance = 0
            max_speed = 0
            total_duration = 0
            
            for idx, quarter_cross in enumerate(quarter_crosses):
                try:
                    # 팀 쿼터 정보 조회
                    team_quarter = TeamQuarter.objects.get(
                        quarter_code=quarter_cross.quarter_code
                    )
                    
                    # 팀 분석 데이터 조회
                    team_anal = TeamAnal.objects.get(
                        quarter_code=quarter_cross.quarter_code
                    )
                    
                    # 쿼터 시간 계산
                    duration_minutes = 0
                    if team_quarter.start_time and team_quarter.end_time:
                        duration_seconds = (team_quarter.end_time - team_quarter.start_time).total_seconds()
                        duration_minutes = duration_seconds / 60
                    
                    # 통계 누적
                    if team_anal.T_D:
                        total_distance += float(team_anal.T_D)
                    if team_anal.T_HS and float(team_anal.T_HS) > max_speed:
                        max_speed = float(team_anal.T_HS)
                    total_duration += duration_minutes
                    
                    # 쿼터 데이터 구성
                    quarter_data = {
                        "quarter": idx + 1,
                        "quarter_code": team_quarter.quarter_code,
                        "name": team_quarter.name,
                        "duration_minutes": round(duration_minutes, 1),
                        "start_time": team_quarter.start_time.isoformat() if team_quarter.start_time else None,
                        "end_time": team_quarter.end_time.isoformat() if team_quarter.end_time else None,
                        "home": team_quarter.home,
                        "status": "완료",
                        
                        # 팀 분석 데이터
                        "distance": round(float(team_anal.T_D), 2) if team_anal.T_D else 0,
                        "max_speed": round(float(team_anal.T_HS), 1) if team_anal.T_HS else 0,
                        "avg_speed": round(float(team_anal.T_AS), 1) if team_anal.T_AS else 0,
                        "points": int(team_anal.point_total or 0),
                        
                        # 팀 레이더 차트 점수
                        "radar_scores": {
                            "attack": int(team_anal.point_attack or 0),
                            "defense": int(team_anal.point_defense or 0),
                            "stamina": int(team_anal.point_stamina or 0),
                            "organization": int(team_anal.point_organization or 0),
                            "speed": int(team_anal.point_speed or 0),
                            "acceleration": int(team_anal.point_acceleration or 0)
                        }
                    }
                    
                    quarters_data.append(quarter_data)
                    
                except (TeamQuarter.DoesNotExist, TeamAnal.DoesNotExist):
                    continue
            
            # 전체 경기 통계
            match_stats = {
                "total_duration_minutes": round(total_duration, 1),
                "quarter_count": len(quarters_data),
                "max_speed": round(max_speed, 1),
                "total_distance": round(total_distance, 2)
            }
            
            response_data = {
                "quarters": quarters_data,
                "match_stats": match_stats
            }
            
            # user_role이 있으면 포함
            if user_role is not None:
                response_data["user_role"] = user_role
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"팀 경기 분석 데이터 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Get_TeamPlayerAnalysisData(APIView):
    """
    팀 선수 분석 데이터 조회 API
    특정 팀 경기에 참여한 선수들의 개인 분석 결과를 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_summary="팀 참여 선수 분석 데이터 조회",
        operation_description="특정 팀 경기에 참여한 선수들의 개인 분석 결과를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'match_code',
                openapi.IN_QUERY,
                description='경기 코드',
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="팀 선수 분석 데이터 조회 성공",
                examples={
                    "application/json": {
                        "players_data": [
                            {
                                "user_code": "u_001",
                                "quarters": [
                                    {
                                        "quarter_code": "q_001",
                                        "team_quarter_code": "q_team_001",
                                        "distance": 5.2,
                                        "max_speed": 24.5,
                                        "avg_speed": 6.1,
                                        "points": 85,
                                        "sprint_count": 12,
                                        "radar_scores": {
                                            "attack": 88,
                                            "defense": 82,
                                            "stamina": 85,
                                            "positiveness": 90,
                                            "speed": 78,
                                            "acceleration": 86
                                        }
                                    }
                                ],
                                "total_stats": {
                                    "total_distance": 10.4,
                                    "max_speed": 26.2,
                                    "avg_points": 83.5,
                                    "quarter_count": 2
                                }
                            }
                        ],
                        "total_players": 10
                    }
                }
            ),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        match_code = request.query_params.get('match_code')
        
        if not match_code:
            return Response(
                {"error": "match_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 해당 경기의 모든 쿼터 조회
            quarter_crosses = TeamMatchQuarterCross.objects.filter(
                match_code=match_code, 
                deleted_at__isnull=True
            )
            
            if not quarter_crosses.exists():
                return Response({
                    "players_data": [],
                    "total_players": 0,
                    "message": "해당 경기의 데이터가 없습니다."
                })
            
            all_players_data = {}
            
            for quarter_cross in quarter_crosses:
                try:
                    # 팀 쿼터 정보 조회
                    team_quarter = TeamQuarter.objects.get(
                        quarter_code=quarter_cross.quarter_code
                    )
                    
                    # player_anal JSON 데이터 파싱
                    if team_quarter.player_anal:
                        try:
                            # JSON 파싱 (문자열인 경우와 딕셔너리인 경우 모두 처리)
                            if isinstance(team_quarter.player_anal, str):
                                player_anal_dict = json.loads(team_quarter.player_anal)
                            else:
                                player_anal_dict = team_quarter.player_anal
                        except (json.JSONDecodeError, TypeError) as e:
                            print(f"JSON parsing error for quarter {quarter_cross.quarter_code}: {e}")
                            continue
                        
                        # {"u_001": "q_001", "u_002": "q_002", ...} 형태
                        for user_code, player_quarter_code in player_anal_dict.items():
                            try:
                                # 팀 경기 개인 분석 데이터 조회 (TeamPlayerAnal 사용)
                                try:
                                    player_anal = TeamPlayerAnal.objects.get(
                                        quarter_code=player_quarter_code
                                    )
                                except TeamPlayerAnal.DoesNotExist:
                                    print(f"TeamPlayerAnal not found for quarter_code: {player_quarter_code}")
                                    continue
                                
                                # 선수별 데이터 누적
                                if user_code not in all_players_data:
                                    # 선수 이름, 포지션, 프로필 이미지, 추가 정보 조회
                                    user_name = user_code
                                    preferred_position = None
                                    profile_image = None
                                    age = None
                                    activity_area = None
                                    number = None
                                    role = 'member'
                                    
                                    try:
                                        user_info = UserInfo.objects.get(user_code=user_code)
                                        user_name = user_info.name or user_code
                                        preferred_position = user_info.preferred_position
                                        activity_area = user_info.activity_area
                                        
                                        print(f"✅ UserInfo 조회 성공 - user_code: {user_code}, name: {user_name}, position: {preferred_position}, activity_area: {activity_area}")
                                        
                                        # birth에서 나이 계산
                                        if user_info.birth:
                                            try:
                                                # birth 형식이 'YYYY-MM-DD' 또는 'YYYYMMDD'일 수 있음
                                                birth_str = str(user_info.birth).replace('-', '')
                                                if len(birth_str) >= 8:
                                                    birth_year = int(birth_str[:4])
                                                    current_year = datetime.now().year
                                                    age = current_year - birth_year
                                                    print(f"✅ 나이 계산 성공 - birth: {user_info.birth}, age: {age}")
                                            except Exception as e:
                                                print(f"❌ Age calculation error for {user_code}: {e}")
                                                age = None
                                        
                                        # 프로필 이미지 조회
                                        try:
                                            from DB.models import ProfileImage
                                            profile_img = ProfileImage.objects.filter(
                                                user_code=user_code,
                                                deleted_at__isnull=True
                                            ).order_by('-created_at').first()
                                            if profile_img and profile_img.image_url:
                                                profile_image = profile_img.image_url
                                        except Exception as e:
                                            print(f"Profile image fetch error for {user_code}: {e}")
                                        
                                        # 팀 멤버 정보 조회 (등번호, 역할) - PlayerTeamCross 사용
                                        try:
                                            # match_code로 team_code 찾기
                                            team_match_cross = TeamMatchCross.objects.filter(
                                                match_code=match_code,
                                                deleted_at__isnull=True
                                            ).first()
                                            
                                            print(f"🔍 TeamMatchCross 조회 - match_code: {match_code}, found: {team_match_cross is not None}")
                                            
                                            if team_match_cross:
                                                print(f"🔍 team_code: {team_match_cross.team_code}")
                                                player_team = PlayerTeamCross.objects.filter(
                                                    team_code=team_match_cross.team_code,
                                                    user_code=user_code,
                                                    deleted_at__isnull=True
                                                ).first()
                                                
                                                print(f"🔍 PlayerTeamCross 조회 - user_code: {user_code}, found: {player_team is not None}")
                                                
                                                if player_team:
                                                    number = player_team.number
                                                    role = player_team.role or 'member'
                                                    print(f"✅ 팀 멤버 정보 조회 성공 - number: {number}, role: {role}")
                                        except Exception as e:
                                            print(f"❌ PlayerTeamCross fetch error for {user_code}: {e}")
                                            
                                    except UserInfo.DoesNotExist:
                                        user_name = user_code
                                    
                                    all_players_data[user_code] = {
                                        "user_code": user_code,
                                        "user_name": user_name,
                                        "position": preferred_position,  # 포지션 정보 추가
                                        "profile_image": profile_image,  # 프로필 이미지 추가
                                        "age": age,  # 나이 추가
                                        "activity_area": activity_area,  # 활동지역 추가
                                        "number": number,  # 등번호 추가
                                        "role": role,  # 역할 추가
                                        "quarters": [],
                                        "total_stats": {
                                            "total_distance": 0,
                                            "max_speed": 0,
                                            "avg_points": 0,
                                            "quarter_count": 0
                                        }
                                    }
                                    
                                    print(f"📦 선수 데이터 저장 - user_code: {user_code}, name: {user_name}, age: {age}, number: {number}, role: {role}, position: {preferred_position}, activity_area: {activity_area}")
                                
                                # 쿼터별 개인 데이터
                                quarter_data = {
                                    "quarter_code": player_quarter_code,
                                    "team_quarter_code": quarter_cross.quarter_code,
                                    "quarter_name": team_quarter.name,
                                    "distance": round(float(player_anal.T_D), 2) if player_anal.T_D else 0,
                                    "max_speed": round(float(player_anal.T_HS), 1) if player_anal.T_HS else 0,
                                    "max_acceleration": round(float(player_anal.T_HA), 2) if player_anal.T_HA else 0,
                                    "avg_speed": round(float(player_anal.T_AS), 1) if player_anal.T_AS else 0,
                                    "points": int(player_anal.point_total or 0),
                                    "sprint_count": int(player_anal.T_S or 0),
                                    
                                    # 개인 레이더 차트 점수
                                    "radar_scores": {
                                        "attack": int(player_anal.point_attack or 0),
                                        "defense": int(player_anal.point_defense or 0),
                                        "stamina": int(player_anal.point_stamina or 0),
                                        "positiveness": int(player_anal.point_positiveness or 0),
                                        "speed": int(player_anal.point_speed or 0),
                                        "acceleration": int(player_anal.point_acceleration or 0)
                                    }
                                }
                                
                                # 중복 데이터 방지: 같은 player_quarter_code가 이미 추가되었다면 스킵
                                duplicate_found = any(
                                    existing_quarter["quarter_code"] == player_quarter_code 
                                    for existing_quarter in all_players_data[user_code]["quarters"]
                                )
                                
                                if duplicate_found:
                                    print(f"Duplicate quarter_code {player_quarter_code} for user {user_code}, skipping...")
                                    continue
                                
                                all_players_data[user_code]["quarters"].append(quarter_data)
                                
                                # 통계 누적
                                stats = all_players_data[user_code]["total_stats"]
                                stats["total_distance"] += quarter_data["distance"]
                                if quarter_data["max_speed"] > stats["max_speed"]:
                                    stats["max_speed"] = quarter_data["max_speed"]
                                stats["avg_points"] += quarter_data["points"]
                                stats["quarter_count"] += 1
                                
                            except TeamPlayerAnal.DoesNotExist:
                                continue
                    
                except TeamQuarter.DoesNotExist:
                    continue
            
            # 평균 계산
            for user_code, player_data in all_players_data.items():
                if player_data["total_stats"]["quarter_count"] > 0:
                    player_data["total_stats"]["avg_points"] = round(
                        player_data["total_stats"]["avg_points"] / player_data["total_stats"]["quarter_count"], 1
                    )
                    player_data["total_stats"]["total_distance"] = round(
                        player_data["total_stats"]["total_distance"], 2
                    )
                    player_data["total_stats"]["max_speed"] = round(
                        player_data["total_stats"]["max_speed"], 1
                    )
            
            # 리스트로 변환
            players_data = list(all_players_data.values())
            
            return Response({
                "players_data": players_data,
                "total_players": len(players_data)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"팀 선수 분석 데이터 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Get_TeamQuarterDetail(APIView):
    """
    팀 쿼터 상세 분석 데이터 조회 API
    특정 팀 쿼터의 상세 분석 결과를 조회합니다 (TeamAnal 모델의 모든 필드 포함).
    """
    
    @swagger_auto_schema(
        operation_description="특정 팀 쿼터의 상세 분석 결과를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'quarter_code',
                openapi.IN_QUERY,
                description='팀 쿼터 코드',
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
        """팀 쿼터 상세 분석 데이터 조회"""
        quarter_code = request.query_params.get('quarter_code')
        
        if not quarter_code:
            return Response(
                {"error": "quarter_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 팀 쿼터 기본 정보 조회
            try:
                team_quarter = TeamQuarter.objects.get(
                    quarter_code=quarter_code
                )
            except TeamQuarter.DoesNotExist:
                return Response(
                    {"error": "해당 쿼터를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 팀 분석 데이터 조회
            try:
                team_anal = TeamAnal.objects.get(quarter_code=quarter_code)
            except TeamAnal.DoesNotExist:
                return Response(
                    {"error": "해당 쿼터의 분석 데이터를 찾을 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 쿼터 기본 정보
            duration_minutes = 0
            if team_quarter.start_time and team_quarter.end_time:
                duration_minutes = (team_quarter.end_time - team_quarter.start_time).total_seconds() / 60
            
            quarter_info = {
                "quarter_code": team_quarter.quarter_code,
                "quarter_name": team_quarter.name,
                "start_time": team_quarter.start_time.isoformat() if team_quarter.start_time else None,
                "end_time": team_quarter.end_time.isoformat() if team_quarter.end_time else None,
                "duration_minutes": round(duration_minutes, 1),
                "home": team_quarter.home
            }
            
            # Total 통계
            total_stats = {
                "distance": float(team_anal.T_D) if team_anal.T_D else 0,
                "time": float(team_anal.T_T) if team_anal.T_T else 0,
                "avg_speed": float(team_anal.T_AS) if team_anal.T_AS else 0,
                "max_speed": float(team_anal.T_HS) if team_anal.T_HS else 0,
                "avg_acceleration": float(team_anal.T_AA) if team_anal.T_AA else 0,
                "max_acceleration": float(team_anal.T_HA) if team_anal.T_HA else 0,
                "speed_list": team_anal.T_AS_L if team_anal.T_AS_L else [],
                "acceleration_list": team_anal.T_AA_L if team_anal.T_AA_L else []
            }
            
            # Attack 통계
            attack_stats = {
                "distance": float(team_anal.A_D) if team_anal.A_D else 0,
                "time": float(team_anal.A_T) if team_anal.A_T else 0,
                "avg_speed": float(team_anal.A_AS) if team_anal.A_AS else 0,
                "max_speed": float(team_anal.A_HS) if team_anal.A_HS else 0,
                "avg_acceleration": float(team_anal.A_AA) if team_anal.A_AA else 0,
                "max_acceleration": float(team_anal.A_HA) if team_anal.A_HA else 0
            }
            
            # Defense 통계
            defense_stats = {
                "distance": float(team_anal.D_D) if team_anal.D_D else 0,
                "time": float(team_anal.D_T) if team_anal.D_T else 0,
                "avg_speed": float(team_anal.D_AS) if team_anal.D_AS else 0,
                "max_speed": float(team_anal.D_HS) if team_anal.D_HS else 0,
                "avg_acceleration": float(team_anal.D_AA) if team_anal.D_AA else 0,
                "max_acceleration": float(team_anal.D_HA) if team_anal.D_HA else 0
            }
            
            # 팀 조율 데이터
            team_coordination = {
                "total": {
                    "coordination": float(team_anal.T_CO) if team_anal.T_CO else 0,
                    "density": float(team_anal.T_DE) if team_anal.T_DE else 0,
                    "stretch": float(team_anal.T_SS) if team_anal.T_SS else 0,
                    "synchronization": float(team_anal.T_SI) if team_anal.T_SI else 0,
                    "length": float(team_anal.T_L) if team_anal.T_L else 0,
                    "width": float(team_anal.T_W) if team_anal.T_W else 0
                },
                "attack": {
                    "coordination": float(team_anal.A_CO) if team_anal.A_CO else 0,
                    "density": float(team_anal.A_DE) if team_anal.A_DE else 0,
                    "stretch": float(team_anal.A_SS) if team_anal.A_SS else 0,
                    "synchronization": float(team_anal.A_SI) if team_anal.A_SI else 0,
                    "length": float(team_anal.A_L) if team_anal.A_L else 0,
                    "width": float(team_anal.A_W) if team_anal.A_W else 0
                },
                "defense": {
                    "coordination": float(team_anal.D_CO) if team_anal.D_CO else 0,
                    "density": float(team_anal.D_DE) if team_anal.D_DE else 0,
                    "stretch": float(team_anal.D_SS) if team_anal.D_SS else 0,
                    "synchronization": float(team_anal.D_SI) if team_anal.D_SI else 0,
                    "length": float(team_anal.D_L) if team_anal.D_L else 0,
                    "width": float(team_anal.D_W) if team_anal.D_W else 0
                }
            }
            
            # 맵 데이터
            map_data = {
                "heatmap": team_anal.T_HMAP if team_anal.T_HMAP else {},
                "position_map": team_anal.T_PMAP if team_anal.T_PMAP else {},
                "zone_map": team_anal.T_ZMAP if team_anal.T_ZMAP else {}
            }
            
            # 레이더 차트 점수
            radar_scores = {
                "total": int(team_anal.point_total or 0),
                "attack": int(team_anal.point_attack or 0),
                "defense": int(team_anal.point_defense or 0),
                "stamina": int(team_anal.point_stamina or 0),
                "organization": int(team_anal.point_organization or 0),
                "speed": int(team_anal.point_speed or 0),
                "acceleration": int(team_anal.point_acceleration or 0),
                "balance": int(team_anal.point_balance or 0)
            }
            
            response_data = {
                "quarter_info": quarter_info,
                "total_stats": total_stats,
                "attack_stats": attack_stats,
                "defense_stats": defense_stats,
                "team_coordination": team_coordination,
                "map_data": map_data,
                "radar_scores": radar_scores,
                "analysis_type": team_anal.AN_T,
                "available_players_avg": float(team_anal.available_players_avg) if team_anal.available_players_avg else 0
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"팀 쿼터 상세 분석 데이터 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


def _extract_team_player_anal_data(anal_data, prefix=''):
    """팀 선수 분석 데이터를 추출하는 헬퍼 함수 - TeamPlayerAnal 모델의 모든 컬럼 포함"""
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
        "time": safe_float(getattr(anal_data, f'{prefix}T', None)),
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
        
        # JSON 리스트 데이터 (있는 경우)
        "speed_list": getattr(anal_data, f'{prefix}AS_L', None),
        "acceleration_list": getattr(anal_data, f'{prefix}AA_L', None),
        "direction_change_90_150_list": getattr(anal_data, f'{prefix}LDT_L', None),
        "direction_change_150_180_list": getattr(anal_data, f'{prefix}HDT_L', None)
    }


class Get_TeamPlayerQuarterData(APIView):
    """
    팀 선수 쿼터 분석 데이터 조회 API
    팀 경기의 특정 선수 쿼터 분석 데이터를 조회합니다 (TeamPlayerAnal 모델 기반).
    """
    
    @swagger_auto_schema(
        operation_description="팀 경기의 특정 선수 쿼터 분석 데이터를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'team_quarter_code',
                openapi.IN_QUERY,
                description="팀 쿼터 코드 (TeamQuarter의 quarter_code)",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'user_code',
                openapi.IN_QUERY,
                description="사용자 코드 (선수 코드)",
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
        """팀 선수 쿼터 분석 데이터 조회"""
        team_quarter_code = request.query_params.get('team_quarter_code')
        user_code = request.query_params.get('user_code')
        
        if not all([team_quarter_code, user_code]):
            return Response(
                {"error": "team_quarter_code and user_code parameters are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 팀 쿼터 정보 조회
            try:
                team_quarter = TeamQuarter.objects.get(
                    quarter_code=team_quarter_code
                )
            except TeamQuarter.DoesNotExist:
                return Response({
                    "error": "Team quarter not found."
                }, status=status.HTTP_404_NOT_FOUND)
            
            # TeamQuarter.player_anal JSON에서 user_code에 해당하는 player_quarter_code 찾기
            player_quarter_code = None
            try:
                if isinstance(team_quarter.player_anal, str):
                    player_anal_dict = json.loads(team_quarter.player_anal)
                else:
                    player_anal_dict = team_quarter.player_anal
                
                player_quarter_code = player_anal_dict.get(user_code)
                
                if not player_quarter_code:
                    return Response({
                        "error": f"Player {user_code} not found in this team quarter."
                    }, status=status.HTTP_404_NOT_FOUND)
                    
            except (json.JSONDecodeError, TypeError, AttributeError) as e:
                return Response({
                    "error": f"Failed to parse player_anal JSON: {str(e)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # 팀 선수 분석 데이터 조회 (TeamPlayerAnal)
            try:
                player_anal_data = TeamPlayerAnal.objects.get(
                    quarter_code=player_quarter_code
                )
            except TeamPlayerAnal.DoesNotExist:
                return Response({
                    "error": f"Analysis data not found for player quarter {player_quarter_code}."
                }, status=status.HTTP_404_NOT_FOUND)
            
            # 경기 정보 조회
            match_cross = TeamMatchQuarterCross.objects.filter(
                quarter_code=team_quarter_code,
                deleted_at__isnull=True
            ).first()
            match_info = None
            if match_cross:
                match_info = TeamMatch.objects.filter(
                    match_code=match_cross.match_code
                ).first()
            
            # 쿼터 기본 정보
            quarter_info = {
                "quarter_code": team_quarter.quarter_code,
                "name": team_quarter.name,
                "start_time": team_quarter.start_time.isoformat() if team_quarter.start_time else None,
                "end_time": team_quarter.end_time.isoformat() if team_quarter.end_time else None,
                "duration": (team_quarter.end_time - team_quarter.start_time).total_seconds() / 60 if team_quarter.start_time and team_quarter.end_time else None,
                "home": team_quarter.home
            }
            
            # 경기 정보
            match_info_data = None
            if match_info:
                match_info_data = {
                    "match_code": match_info.match_code,
                    "name": match_info.name,
                    "start_time": match_info.start_time.isoformat() if match_info.start_time else None,
                    "end_time": match_info.end_time.isoformat() if match_info.end_time else None,
                    "standard": getattr(match_info, 'standard', 'north')
                }
            
            # Total 분석 데이터 (전체 쿼터)
            total_data = _extract_team_player_anal_data(player_anal_data, 'T_')
            total_data.update({
                "heatmap_data": player_anal_data.T_HMAP if player_anal_data.T_HMAP else None,
                "sprint_map_data": player_anal_data.T_SMAP if player_anal_data.T_SMAP else None,
                "direction_map_data": player_anal_data.T_DMAP if player_anal_data.T_DMAP else None
            })
            
            # Attack 분석 데이터 (공격 상황)
            attack_data = _extract_team_player_anal_data(player_anal_data, 'A_')
            
            # Defense 분석 데이터 (수비 상황)
            defense_data = _extract_team_player_anal_data(player_anal_data, 'D_')
            
            # 포인트 데이터
            point_data = {
                "total": int(player_anal_data.point_total or 0),
                "attack": int(player_anal_data.point_attack or 0),
                "defense": int(player_anal_data.point_defense or 0),
                "stamina": int(player_anal_data.point_stamina or 0),
                "positiveness": int(player_anal_data.point_positiveness or 0),
                "speed": int(player_anal_data.point_speed or 0),
                "acceleration": int(player_anal_data.point_acceleration or 0),
                "sprint": int(player_anal_data.point_sprint or 0)
            }
            
            # 노이즈 데이터
            noise_data = {
                "time_noise": float(player_anal_data.N_T or 0),
                "gps_noise": float(player_anal_data.N_G or 0),
                "reliability": float(player_anal_data.N_P or 0)
            }
            
            return Response({
                "quarter_info": quarter_info,
                "match_info": match_info_data,
                "total_data": total_data,
                "attack_data": attack_data,
                "defense_data": defense_data,
                "point_data": point_data,
                "noise_data": noise_data,
                "created_at": player_anal_data.created_at.isoformat() if player_anal_data.created_at else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"팀 선수 쿼터 분석 데이터 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

