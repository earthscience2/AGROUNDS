from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from DB.models import GroundInfo

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class Get_GroundSearch(APIView):
    """
    경기장 코드로 경기장 정보 조회 API
    """
    
    @swagger_auto_schema(
        operation_description="경기장 코드로 경기장 정보를 조회합니다.",
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="경기장을 찾을 수 없음")
        }
    )
    def get(self, request):
        ground_code = request.query_params.get('ground_code')
        
        if not ground_code:
            return Response(
                {"error": "ground_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 경기장 정보 조회
            ground = get_object_or_404(GroundInfo, ground_code=ground_code)
            
            return Response({
                "ground_code": ground.ground_code,
                "name": ground.name,
                "address": ground.address,
                "who_make": ground.who_make,
                "long_side_length": ground.long_side_length,
                "short_side_length": ground.short_side_length,
                "rotate_deg": ground.rotate_deg,
                "center": ground.center,
                "created_at": ground.created_at.isoformat() if ground.created_at else None,
                "updated_at": ground.updated_at.isoformat() if ground.updated_at else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

