from rest_framework import serializers
from DB.models import V2_UserInfo

from user.serializers import User_info_Serializer

class V2_User_info_Serializer(User_info_Serializer):
    class Meta:
        fields = '__all__'
        model = V2_UserInfo
        # password 제외하고 리턴
        extra_kwargs = {
    	    'password' : {'write_only' : True },
            'user_code' : {'required' : False}
	    }