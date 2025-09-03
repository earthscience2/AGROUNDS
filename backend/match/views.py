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


class addMatchInfo(APIView):
    """
    경기 정보 추가 (match 앱에서 처리)
    """
    
    @swagger_auto_schema(
        operation_summary="경기 정보 추가",
        operation_description="새로운 경기 정보를 추가합니다.",
        responses={
            200: openapi.Response(description="경기 정보 추가 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request, *args, **kwargs):
        # QueryDict인 경우 mutable하게 복사합니다.
        data = request.data.copy() if hasattr(request.data, 'copy') else request.data

        # 최상위 필수 필드 검사
        required_fields = ["match_code", "user_code", "ground_code", "quarter_info"]
        for field in required_fields:
            if field not in data:
                return Response(
                    {"error": f"'{field}' 필드는 필수입니다."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        quarter_info = data["quarter_info"]
        user_code = data["user_code"]
        match_code = data["match_code"]
        ground_code = data["ground_code"]

        # quarter_info가 리스트인지 검사하고, 문자열이면 변환 시도
        if not isinstance(quarter_info, list):
            if isinstance(quarter_info, str):
                try:
                    converted = json.loads(quarter_info)
                    if not isinstance(converted, list):
                        raise ValueError("변환된 값이 리스트가 아님")
                    data["quarter_info"] = converted
                except Exception as e:
                    return Response(
                        {"error": f"'quarter_info' 필드는 리스트여야 합니다. 문자열 변환 실패: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {"error": "'quarter_info' 필드는 리스트여야 합니다."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # quarter_info 내부 각 객체의 필수 필드 검사
        quarter_required_fields = ["quarter_name", "match_start_time", "match_end_time", "start_time", "end_time", "status", "home"]
        for idx, quarter in enumerate(data["quarter_info"]):
            if not isinstance(quarter, dict):
                return Response(
                    {"error": f"'quarter_info'의 {idx}번째 항목은 객체여야 합니다."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            for field in quarter_required_fields:
                if field not in quarter:
                    return Response(
                        {"error": f"'quarter_info' 항목에 '{field}' 필드는 필수입니다."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # start_time, end_time의 datetime 형식 검사
                if field in ["start_time", "end_time"]:
                    time_str = quarter[field]
                    valid = False
                    for fmt in ("%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S"):
                        try:
                            datetime.strptime(time_str, fmt)
                            valid = True
                            break
                        except ValueError:
                            continue
                    if not valid:
                        return Response(
                            {"error": f"'{field}' 필드는 올바른 datetime 문자열이 아닙니다."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
        # 분석 코드 요구사항에 맞는 quater_info 형식으로 변환
        formatted_quarter_info = []
        for quarter in data["quarter_info"]:
            formatted_quarter_info.append({
                "quarter" : quarter["quarter_name"],
                "start_time" : quarter["start_time"],
                "end_time" : quarter["end_time"],
                "status" : quarter["status"],
                "home" : "west" if quarter["home"] == "left" else "east" if quarter["home"] == "right" else "no"
            })

        # ground_code로 ground_name 조회
        ground_name = get_object_or_404(GroundInfo, ground_code = ground_code).name

        # 경기 날짜 추출 yyyymmdd 형식
        date_string = data["quarter_info"][0]["match_start_time"]
        dt = datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S")
        formatted_date = dt.strftime("%Y%m%d%H%M")[2:] #yymmddhhmm 형식

        # 분석 코드에서 필요한 quarter_info.json파일 생성 후 s3에 업로드
        upload_quarter_info = {}
        upload_quarter_info["data_file"] = f"/home/ubuntu/my_folder/data/edit_data/{user_code}_{match_code}_{formatted_date}_edit.txt"
        upload_quarter_info["ground_name"] = ground_name
        upload_quarter_info["standard"] = data["standard"]
        upload_quarter_info["quarter_info"] = {
            "total_quarters" : len(formatted_quarter_info),
            "quarters" : formatted_quarter_info
        }

        # json파일로 변환
        json_str = json.dumps(upload_quarter_info)
        json_bytes = json_str.encode('utf-8')

        quarter_info_file = io.BytesIO(json_bytes)
        setattr(quarter_info_file, 'content_type', 'application/json')

        # s3에 json 파일 업로드
        try:
            fileUploader = S3FileUploader(quarter_info_file, f"gps/{data['match_code']}/{data['user_code']}/quarter_info.json")
            fileUploader.upload()
        except Exception as e:
            return Response({"error" : f"파일 업로드 실패: {e}"})

        # 모든 유효성 검사를 통과하고 파일 업로드까지 성공한 경우
        return Response({"result" : "success"})


class GetMatchDetailView(APIView):
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
                    ai_summary = player_ai.answer
            except PlayerAi.DoesNotExist:
                ai_summary = "AI 분석이 아직 완료되지 않았습니다."
            
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
                        "status": q.status
                    } for q in quarters
                ],
                "ai_summary": ai_summary
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
