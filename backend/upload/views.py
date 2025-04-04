from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime
from DB.models import GroundInfo
from staticfiles.file_uploader import S3FileUploader
import json
import io

class addMatchInfo(APIView):
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
        ground_name = get_object_or_404(GroundInfo, ground_code = data["ground_code"]).ground_name

        # 경기 날짜 추출 yyyymmdd 형식
        date_string = data["quarter_info"][0]["match_start_time"]
        dt = datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S")
        formatted_date = dt.strftime("%Y%m%d")

        # 분석 코드에서 필요한 quarter_info.json파일 생성 후 s3에 업로드
        upload_quarter_info = {}
        upload_quarter_info["data_file"] = f"gps/{data['match_code']}/{data['user_code']}/{data['user_code']}_{formatted_date}.txt"
        upload_quarter_info["ground_name"] = ground_name
        upload_quarter_info["standard"] = data["standard"]
        upload_quarter_info["quarter_info"] = {
            "total_quarters" : len(quarter_info),
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