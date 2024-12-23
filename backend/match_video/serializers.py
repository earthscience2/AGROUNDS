from rest_framework import serializers
from DB.models import *
from V2_login.serializers import V2_UpdateUserInfoSerializer, V2_User_info_Serializer_summary
from staticfiles.make_code import make_code
from staticfiles.get_info import get_team_code_by_team_name
from staticfiles.get_info import update_team_match_code
import re

class Match_Info_Serializer(serializers.ModelSerializer):
    class Meta:
        model = MatchInfo
        fields = '__all__'

    