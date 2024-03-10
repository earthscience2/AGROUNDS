from drf_yasg import openapi

MatchMoreInfoAPI_parameter = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'match_code': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
    }
)