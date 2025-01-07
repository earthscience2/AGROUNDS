from rest_framework import serializers
from DB.models import *
from staticfiles.get_file_url import get_file_url

class Video_List_Serializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    class Meta:
        model = VideoInfo
        fields = ['match_code', 'title', 'date', 'thumbnail']

    def get_thumbnail(self, obj):
        return get_file_url('video/thumbnail/thumbnail1.png')

class Video_Info_Serializer(serializers.ModelSerializer):
    quarter = serializers.SerializerMethodField()
    match_location = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()
    download_link = serializers.SerializerMethodField()

    class Meta:
        model = VideoInfo
        fields = ['quarter', 'title', 'match_location', 'date', 'thumbnail', 'link', 'download_link']

    def get_quarter(self, obj):
        return obj.quarter_name
    
    def get_match_location(self, obj):
        match_info = None
        if obj.type == 'player' :
            match_info = UserMatchInfo.objects.filter(match_code = obj.match_code).first()
        else :
            match_info = TeamMatchInfo.objects.filter(match_code = obj.match_code).first()
        if match_info is None:
                return '-'
        return match_info.ground_name
    
    def get_thumbnail(self, obj):
        return get_file_url('video/thumbnail/thumbnail1.png')

    def get_link(self, obj):
        path = obj.path
        if path.startswith("http"):
            return path
        elif path != '':
            return get_file_url(path)
        
        if obj.type == 'player':
            return get_file_url(f'video/{obj.match_code}/{obj.quarter_name}/player_pc/{obj.user_code}/{obj.user_code}.mpd')
        else :
            return get_file_url(f'video/{obj.match_code}/{obj.quarter_name}/{obj.type}/{obj.type}.mpd')

    def get_download_link(self, obj): 
        if obj.type == 'player':
            return get_file_url(f'video/{obj.match_code}/{obj.quarter_name}/player_pc/{obj.user_code}.mp4/')
        else :
            return get_file_url(f'video/{obj.match_code}/{obj.quarter_name}/{obj.type}.mp4')
