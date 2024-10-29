from rest_framework import serializers
from DB.models import *
import re
class User_main_page(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'
        

class UserMainPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = [
            'user_id', 'password', 'user_birth', 'user_name', 'user_gender', 
            'user_nickname', 'marketing_agree', 'user_height', 'user_weight', 'user_position'
        ]

    def __init__(self, *args, **kwargs):
        # user_code를 인스턴스 변수로 받도록 초기화
        self.user_code = kwargs.pop('user_code', None)
        super().__init__(*args, **kwargs)

    def validate_user_nickname(self, value):
        # 자신의 user_code와 닉네임이 동일한 경우 중복 확인을 하지 않음
        if UserInfo.objects.filter(user_nickname=value).exclude(user_code=self.user_code).exists():
            raise serializers.ValidationError("이미 존재하는 닉네임입니다.")
        return value

    def validate_password(self, value):
        # 비밀번호 정규식: 최소 8자, 하나 이상의 대문자, 소문자, 숫자 및 특수 문자 포함
        password_pattern = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
        
        if not re.match(password_pattern, value):
            raise serializers.ValidationError(
                "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수 문자를 포함해야 합니다."
            )
        return value
