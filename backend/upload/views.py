from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime
import json

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
        quarter_required_fields = ["quarter_name", "start_time", "end_time", "status", "home"]
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

        # 모든 유효성 검사를 통과한 경우
        return Response({"message": "데이터가 유효합니다."}, status=status.HTTP_200_OK)