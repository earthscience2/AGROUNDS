from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'user_code',
            'user_id',
            'user_pw',
            'user_birth',
            'user_name',
            'user_gender',
            'user_email',
            'user_team',
            
        )
        model = Post