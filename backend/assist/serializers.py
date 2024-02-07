from rest_framework import serializers
from .models import User_info


class User_info_Serializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "user_code",
            "user_id",
            "user_pw",
            "user_birth",
            "user_name",
            "user_gender",
            "user_nickname",
        )
        model = User_info
