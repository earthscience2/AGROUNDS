from rest_framework import serializers
from DB.models import UserInfo
from DB.models import UserTeam
from DB.models import TeamInfo

from rest_framework import serializers

from django.contrib.auth.hashers import make_password
from staticfiles.make_code import make_code
from datetime import datetime

from staticfiles.get_file_url import get_file_url 

import re

class User_Info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = UserInfo
        # password 제외하고 리턴
        extra_kwargs = {
    	    'password' : {'write_only' : True },
            'user_code' : {'required' : False},
            'user_type' : {'required' : False},
            'marketing_agree' : {'required' : False},
	    }

    def create(self,validated_data):
        password = validated_data.pop('password',None)
        instance = self.Meta.model(**validated_data)

        if instance.login_type == "common":
            instance.password = make_password(password)

        instance.user_code = make_code('u')
        instance.user_type = "-1"

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
        return re.compile(r''+pattern).match(text)
    
    def regexes_all(self, user_id, password, user_nickname, user_name, user_birth):
        patterns = ['^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
                    '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$',
                    '^[a-zA-Z가-힣0-9!@#$%^&*()-_=+{};:,<.>]{3,10}$',
                    '^[가-힣a-zA-Z]{2,20}$',
                    '^(?:(?:19|20)\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$' ]
        items = [user_id, password, user_nickname, user_name, user_birth]
        massges = ['이메일', '패스워드', '닉네임', '이름', '생년월일']

        for i in range (0, 5):
            if (self.regexes(patterns[i], items[i]) == None): # 소셜 회원가입의 경우 password가 0, 유효성검사 건너뜀
                if (i == 1 and items[i] == "0"):
                    return None
                raise serializers.ValidationError({"error" : "올바르지 않은 " + massges[i] +" 형식입니다."})
        return None
    
class Essecial_User_Info(serializers.ModelSerializer):
    user_age = serializers.SerializerMethodField()  # 사용자 정의 필드 추가
    user_logo = serializers.SerializerMethodField()

    class Meta:
        model = UserInfo
        fields = ['user_code', 'user_nickname', 'user_id', 'user_age', 'user_logo', 'user_position', 'user_type']

    def get_user_age(self, obj):
        if hasattr(obj, 'user_birth') and obj.user_birth:
            try:
                birth_date = datetime.strptime(obj.user_birth, '%Y-%m-%d').date()
                today = datetime.today().date()
                age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                return age
            except ValueError:
                raise serializers.ValidationError("user_birth의 형식이 잘못되었습니다. 'yyyy-mm-dd' 형식이어야 합니다.")
        return None  # user_birth가 없거나 유효하지 않은 경우
    
    def get_user_logo(self, obj):
        user_team = UserTeam.objects.filter(user_code = obj.user_code)
        if user_team.exists():
            team = TeamInfo.objects.filter(team_code = user_team.first().team_code)
            if team.exists():
                return get_file_url(team.first().team_logo)
        return get_file_url('img/teamlogo/default-team-logo.png')
            
    
    
# class Login_Serializer(serializers.Serializer):
#     user_id = serializers.CharField(required = True)
#     password = serializers.CharField(required = True, write_only = True)

#     def validate(self, data):
#         user = authenticate(**data)
#         if user:
#             token = Token.objects.get(user=user) # 해당 유저의 토큰을 불러옴
#             return token
#         raise serializers.ValidationError( # 가입된 유저가 없을 경우
#             {"error": "Unable to log in with provided credentials."}
#     )