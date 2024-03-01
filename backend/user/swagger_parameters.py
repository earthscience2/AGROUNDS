from drf_yasg import openapi

test_view_parameter = openapi.Parameter("nickname", openapi.IN_QUERY, description="nickname", type=openapi.TYPE_STRING)