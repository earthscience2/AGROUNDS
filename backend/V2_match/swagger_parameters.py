from drf_yasg import openapi

# MatchMoreInfoAPI_parameter = openapi.Schema(
#     type=openapi.TYPE_OBJECT, 
#     properties={
#         'match_code': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
#     }
# )

MatchMoreInfoAPI_parameters = [openapi.Parameter("match_code", openapi.IN_QUERY, description="match_code", type=openapi.TYPE_STRING)]