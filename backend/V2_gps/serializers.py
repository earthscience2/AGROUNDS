from rest_framework import serializers
from DB.models import V2_UserInfo

from rest_framework import serializers
from staticfiles.get_file_url import get_file_url


class gps_data_serializers(serializers.Serializer):
    match_code = serializers.CharField()
    team_code = serializers.CharField()

    def create(self, validated_data):
        match_code = validated_data.get('match_code')
        team_code = validated_data.get('team_code')
        
        path = f'data/personaldata/Heatmap/Heatmap.png'
        file_url = get_file_url(path)
        return {'file_url': file_url}
