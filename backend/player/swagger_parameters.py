from drf_yasg import openapi

test_view_parameter = openapi.Parameter("user_code", openapi.IN_QUERY, description="user_code", type=openapi.TYPE_STRING)