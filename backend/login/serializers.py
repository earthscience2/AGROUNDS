from rest_framework import serializers
from DB.models import UserInfo

from django.http import JsonResponse
from django.contrib.auth.hashers import make_password

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

import re

class User_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = UserInfo
        # password 제외하고 리턴
        extra_kwargs = {
    	    'password' : {'write_only' : True },
            'user_code' : {'default' : 0}
	    }
    
    def create(self,validated_data):
        password = validated_data.pop('password',None)
        instance = self.Meta.model(**validated_data)
        if password is not None :
            # hashing password
            instance.password = make_password(password)
        instance.save()
        return instance
    
    
    def validate(self, data):
        user_id = data.get('user_id', None)
        password = data.get("password")
        user_birth = data.get("user_birth")
        user_name = data.get("user_name")
        user_gender = data.get("user_gender")
        user_nickname = data.get("user_nickname")
        marketing_agree = data.get("marketing_agree")

        # 모든 항목을 입력받았는지 검사
        if (
            not user_id
            or not password
            or not user_birth
            or not user_name
            or not user_gender
            or not user_nickname
        ):
            raise serializers.ValidationError({"error" : "모든 필드는 필수입니다."})
        
        # 정규식 적용 유효성 검사
        self.regexes_all(user_id, password, user_nickname, user_name, user_birth)
        
        # 닉네임 중복 확인
        if UserInfo.objects.filter(user_nickname=user_nickname).exists():
            raise serializers.ValidationError({"error" : "이미 존재하는 닉네임입니다."})

        # 이메일 중복 확인
        if UserInfo.objects.filter(user_id=user_id).exists():
            raise serializers.ValidationError({"error" : "이미 가입된 이메일입니다."})
        return data

    def regexes(self, pattern, text):
        print(text)
        return re.compile(r''+pattern).match(text)
    
    def regexes_all(self, user_id, password, user_nickname, user_name, user_birth):
        patterns = ['^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
                    '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$',
                    '^[a-zA-Z가-힣0-9!@#$%^&*()-_=+{};:,<.>]{3,10}$',
                    '^[가-힣a-zA-Z]{2,20}$',
                    '^\d{8}$' ]
        items = [user_id, password, user_nickname, user_name, user_birth]
        massges = ['이메일', '패스워드', '닉네임', '이름', '생년월일']

        for i in range (0, 5):
            if (self.regexes(patterns[i], items[i]) == None):
                print(serializers.ValidationError("올바르지 않은 " + massges[i] +" 형식입니다."))
                raise serializers.ValidationError({"error" : "올바르지 않은 " + massges[i] +" 형식입니다."})
        
        return None
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Customizes JWT default Serializer to add more information about user"""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = user.user_id
        token['password'] = user.password
        
        return token