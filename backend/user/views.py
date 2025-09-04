from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

# 명시적 모델 임포트
from DB.models import UserInfo
from .serializers import UserChangeSerializer

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# 사용자 정보 조회
class Get_UserInfo_Simple(APIView):    
    @swagger_auto_schema(
        operation_description="사용자 정보를 조회합니다.",
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="사용자를 찾을 수 없음")
        }
    )
    def get(self, request):
        """사용자 정보 조회"""
        user_code = request.query_params.get('user_code')
        
        if not user_code:
            return Response(
                {"error": "user_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_info = get_object_or_404(UserInfo, user_code=user_code)
            serializer = UserChangeSerializer(user_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"사용자 정보 조회 실패: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def patch(self, request):
        """사용자 정보 수정"""
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


# 사용자 삭제
class UserDelete(APIView):
    """
    회원 탈퇴 API (DELETE)
    헤더에 JWT 토큰 필요
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        try:
            user_info = UserInfo.objects.get(user_code=user.user_code)
            user_info.delete()
            return Response({"message": "회원 탈퇴가 완료되었습니다."}, status=200)
        except UserInfo.DoesNotExist:
            return Response({"error": "해당 사용자가 존재하지 않습니다."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)