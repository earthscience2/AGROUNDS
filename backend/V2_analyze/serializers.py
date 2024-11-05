from rest_framework import serializers
from DB.models import UserInfo

from rest_framework import serializers
from staticfiles.get_file_url import get_file_url

class S3HeatmapURL(serializers.Serializer):
    name = serializers.CharField()

    def create(self, validated_data):
        name = validated_data.get('name')
        # path = f'data/personaldata/Heatmap/{name}.png'
        path = f'data/personaldata/Heatmap/Heatmap.png'
        file_url = get_file_url(path)
        return {'file_url': file_url}

class S3RouteURL(serializers.Serializer):
    name = serializers.CharField()

    def create(self, validated_data):
        name = validated_data.get('name')
        # path = f'data/personaldata/Route/{name}.png'
        path = f'data/personaldata/Route/Route.png'
        file_url = get_file_url(path)
        return {'file_url': file_url}

class S3VectorURL(serializers.Serializer):
    name = serializers.CharField()

    def create(self, validated_data):
        name = validated_data.get('name')
        # path = f'data/personaldata/Vector/{name}.png'
        path = f'data/personaldata/Vector/Vector.png'
        file_url = get_file_url(path)
        return {'file_url': file_url}

class S3VodURL(serializers.Serializer):
    name = serializers.CharField()

    def create(self, validated_data):
        name = validated_data.get('name')
        # path = f'data/personaldata/Vector/{name}.png'
        path = f'vod/mp4/3.mp4'
        file_url = get_file_url(path)
        return {'file_url': file_url}