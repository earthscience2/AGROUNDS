from rest_framework import serializers
from DB.models import UserInfo
import re

class User_main_page(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'
        

class UserChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = [
            'user_code', 'birth', 'name', 'gender', 
            'marketing_agree', 'height', 'weight', 'preferred_position',
            'user_type', 'level', 'activity_area', 'ai_type'
        ]

    def __init__(self, *args, **kwargs):
        # user_code를 인스턴스 변수로 받도록 초기화
        self.user_code = kwargs.pop('user_code', None)
        super().__init__(*args, **kwargs)

    def validate_name(self, value):
        # 이름 유효성 검사 (필요한 경우)
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("이름은 필수입니다.")
        return value

    def validate_preferred_position(self, value):
        # 포지션 유효성 검사
        valid_positions = ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LWM', 'RWM', 'LWF', 'RWF']
        if value and value not in valid_positions:
            raise serializers.ValidationError(f"유효하지 않은 포지션입니다. 선택 가능한 포지션: {', '.join(valid_positions)}")
        return value
