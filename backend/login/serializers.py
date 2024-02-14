from rest_framework import serializers
from DB.models import UserInfo

from django.http import JsonResponse
from django.contrib.auth.hashers import make_password

import re

class User_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = UserInfo
        # user_pw 제외하고 리턴
        extra_kwargs = {
    	    'user_pw' : {'write_only' : True },
            'user_code' : {'default' : 0}
	    }
    
    def create(self,validated_data):
        user_pw = validated_data.pop('user_pw',None)
        instance = self.Meta.model(**validated_data)
        if user_pw is not None :
            # hashing user_pw
            instance.user_pw = make_password(user_pw)
        instance.save()
        return instance
        
    def validate(self, data):
        print(data)
        try:
            user_id = data.get('user_id', None)
            user_pw = data.get("user_pw")
            user_birth = data.get("user_birth")
            user_name = data.get("user_name")
            user_gender = data.get("user_gender")
            user_nickname = data.get("user_nickname")
            marketing_agree = data.get("marketing_agree")

            print(data)

            # 모든 항목을 입력받았는지 검사
            if (
                not user_id
                or not user_pw
                or not user_birth
                or not user_name
                or not user_gender
                or not user_nickname
            ):
                raise serializers.ValidationError("error : 모든 필드는 필수입니다.")
            
            # 정규식 적용 유효성 검사
            regexes = self.regexes_all(user_id, user_pw, user_nickname, user_name, user_birth)
            if(regexes != None) :
                raise serializers.ValidationError(regexes)
            
            # 닉네임 중복 확인
            if UserInfo.objects.filter(user_nickname=user_nickname).exists():
                raise serializers.ValidationError("error : 이미 존재하는 닉네임입니다.")

            # 이메일 중복 확인
            if UserInfo.objects.filter(user_id=user_id).exists():
                raise serializers.ValidationError("error : 이미 가입된 이메일입니다.")
        except Exception as e:  
            raise serializers.ValidationError('error : ' + str(e))
        return data


    def regexes(self, pattern, text):
        print(text)
        return re.compile(r''+pattern).match(text)
    
    def regexes_all(self, user_id, user_pw, user_nickname, user_name, user_birth):
        patterns = ['^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
                    '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$',
                    '^[a-zA-Z가-힣0-9!@#$%^&*()-_=+{};:,<.>]{3,10}$',
                    '^[가-힣a-zA-Z]{2,20}$',
                    '^\d{8}$' ]
        items = [user_id, user_pw, user_nickname, user_name, user_birth]
        massges = ['이메일', '패스워드', '닉네임', '이름', '생년월일']

        for i in range (0, 5):
            if (self.regexes(patterns[i], items[i]) == None):
                return "error : 올바르지 않은 " + massges[i] +" 형식입니다."
        
        return None