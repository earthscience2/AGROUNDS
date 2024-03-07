from drf_yasg import openapi

get_player_detail_parameters = [openapi.Parameter("user_code", openapi.IN_QUERY, description="user_code", type=openapi.TYPE_STRING)]
                        # openapi.Parameter("position", openapi.IN_QUERY, description="position", type=openapi.TYPE_STRING)]

searh_players_parameters = [openapi.Parameter("page", openapi.IN_QUERY, description="page", type=openapi.TYPE_STRING),
                        openapi.Parameter("position", openapi.IN_QUERY, description="position", type=openapi.TYPE_STRING)]