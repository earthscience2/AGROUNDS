from rest_framework import serializers
from DB.models import PlayerVideo, PlayerVideoFolder


class PlayerVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerVideo
        fields = [
            'video_code',
            'folder_code', 
            'quarter_code',
            'url',
            'created_at',
            'updated_at'
        ]


class PlayerVideoFolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerVideoFolder
        fields = [
            'folder_code',
            'user_code',
            'name',
            'created_at',
            'updated_at'
        ]
