from rest_framework import serializers
from DB.models import UserInfo, TeamInfo, PlayerTeamCross, ContentBoard, ContentComment, ContentEventParticipation
from django.db.models import Count
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
        if value and len(value.strip()) == 0:
            raise serializers.ValidationError("이름은 필수입니다.")
        return value

    def validate_preferred_position(self, value):
        # 포지션 유효성 검사
        valid_positions = ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LWM', 'RWM', 'LWF', 'RWF', 'ST']
        if value and value not in valid_positions:
            raise serializers.ValidationError(f"유효하지 않은 포지션입니다. 선택 가능한 포지션: {', '.join(valid_positions)}")
        return value


class TeamSearchSerializer(serializers.ModelSerializer):
    """팀 검색 결과 시리얼라이저"""
    members_count = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TeamInfo
        fields = [
            'team_code', 'name', 'local',
            'members_count', 'formatted_date', 'logo_url',
            'created_at'
        ]
    
    def get_members_count(self, obj):
        """팀 멤버 수 조회"""
        try:
            count = PlayerTeamCross.objects.filter(
                team_code=obj.team_code,
                deleted_at__isnull=True
            ).count()
            return count
        except:
            return 0
    
    def get_formatted_date(self, obj):
        """생성일을 포맷팅된 문자열로 반환"""
        if obj.created_at:
            return obj.created_at.strftime('%Y.%m.%d')
        return ""
    
    def get_logo_url(self, obj):
        """팀 로고 URL 생성"""
        # 기본 로고 또는 팀별 로고 경로 생성
        try:
            # 팀 로고가 있는 경우 해당 경로 반환
            logo_filename = f"{obj.team_code}.png"
            return f"https://agrounds.com/media/team_logo/{logo_filename}"
        except:
            # 기본 로고 반환
            return "https://agrounds.com/media/team_logo/default_profile.png"


class TeamListSerializer(serializers.ModelSerializer):
    """팀 목록 시리얼라이저 (간단한 정보)"""
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TeamInfo
        fields = ['team_code', 'name', 'local', 'members_count']
    
    def get_members_count(self, obj):
        """팀 멤버 수 조회"""
        try:
            return PlayerTeamCross.objects.filter(
                team_code=obj.team_code,
                deleted_at__isnull=True
            ).count()
        except:
            return 0


class ContentBoardListSerializer(serializers.ModelSerializer):
    """컨텐츠 보드 목록 시리얼라이저"""
    comment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ContentBoard
        fields = [
            'content_code', 'category', 'title', 'content',
            'thumbnail_url', 'view_count', 'like_count',
            'event_start_date', 'event_end_date', 'priority',
            'is_pinned', 'notice_start_date', 'notice_end_date',
            'inquiry_type', 'status', 'is_private', 'is_published',
            'tags', 'created_at', 'updated_at', 'comment_count'
        ]
    
    def get_comment_count(self, obj):
        """댓글 수 조회"""
        try:
            return ContentComment.objects.filter(
                content_code=obj.content_code,
                deleted_at__isnull=True
            ).count()
        except:
            return 0


class ContentBoardDetailSerializer(serializers.ModelSerializer):
    """컨텐츠 보드 상세 시리얼라이저"""
    comment_count = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    
    class Meta:
        model = ContentBoard
        fields = [
            'content_code', 'category', 'author_code', 'title', 'content',
            'thumbnail_url', 'image_urls', 'attachment_urls',
            'view_count', 'like_count',
            'event_start_date', 'event_end_date', 'event_link', 'event_reward',
            'event_conditions', 'priority', 'is_pinned',
            'notice_start_date', 'notice_end_date',
            'inquiry_type', 'status', 'related_match_code',
            'related_quarter_code', 'related_team_code', 'related_ground_code',
            'answer', 'answered_by', 'answered_at',
            'is_private', 'target_user_type', 'is_published',
            'published_at', 'metadata', 'tags',
            'created_at', 'updated_at',
            'comment_count', 'comments'
        ]
    
    def get_comment_count(self, obj):
        """댓글 수 조회"""
        try:
            return ContentComment.objects.filter(
                content_code=obj.content_code,
                deleted_at__isnull=True
            ).count()
        except:
            return 0
    
    def get_comments(self, obj):
        """댓글 목록 조회"""
        try:
            comments = ContentComment.objects.filter(
                content_code=obj.content_code,
                parent_comment_code__isnull=True,  # 최상위 댓글만
                deleted_at__isnull=True
            ).order_by('-created_at')
            return ContentCommentSerializer(comments, many=True).data
        except:
            return []


class ContentCommentSerializer(serializers.ModelSerializer):
    """댓글 시리얼라이저"""
    replies = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ContentComment
        fields = [
            'comment_code', 'content_code', 'user_code',
            'comment', 'parent_comment_code', 'like_count',
            'created_at', 'updated_at',
            'user_name', 'replies'
        ]
    
    def get_replies(self, obj):
        """대댓글 조회"""
        try:
            replies = ContentComment.objects.filter(
                parent_comment_code=obj.comment_code,
                deleted_at__isnull=True
            ).order_by('created_at')
            return ContentCommentSerializer(replies, many=True).data
        except:
            return []
    
    def get_user_name(self, obj):
        """사용자 이름 조회"""
        try:
            user_info = UserInfo.objects.get(user_code=obj.user_code, deleted_at__isnull=True)
            return user_info.name if user_info.name else '익명'
        except:
            return '익명'


class ContentEventParticipationSerializer(serializers.ModelSerializer):
    """이벤트 참여 시리얼라이저"""
    
    class Meta:
        model = ContentEventParticipation
        fields = [
            'content_code', 'user_code', 'is_completed',
            'reward_received', 'participation_data',
            'created_at', 'updated_at'
        ]


class InquiryCreateSerializer(serializers.ModelSerializer):
    """문의사항 생성 시리얼라이저"""
    
    class Meta:
        model = ContentBoard
        fields = [
            'inquiry_type', 'title', 'content',
            'related_match_code', 'related_quarter_code',
            'related_team_code', 'related_ground_code',
            'is_private'
        ]
    
    def validate_title(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("제목은 필수입니다.")
        return value
    
    def validate_content(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("문의 내용은 필수입니다.")
        return value
