from rest_framework import serializers
from DB.models import *

class User_main_page(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = '__all__'
