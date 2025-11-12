
from django.urls import path, include
from . import views

# 기본 URL 패턴 (user/ 경로용)
urlpatterns = [
    path("get-user-info/", views.Get_UserInfo_Simple.as_view()),
    path("delete-user/", views.UserDelete.as_view()),
    path("check-name-duplicate/", views.CheckNameDuplicate.as_view()),
    path("profile-image/upload/", views.ProfileImageUpload.as_view()),
    path("profile-image/get/", views.ProfileImageGet.as_view()),
    path("upload-list/", views.UserUploadList.as_view()),
    path("team-upload-list/", views.TeamUploadList.as_view()),
    path("file-download/", views.S3FileDownload.as_view()),
    # 유저 검색 API
    path("search/", views.UserSearch.as_view()),
    # 팀 관련 API
    path("team/search/", views.TeamSearch.as_view()),
    path("team/recommendations/", views.TeamRecommendations.as_view()),
    path("team/logo/upload/", views.TeamLogoUpload.as_view()),
    path("team/logo/get/", views.TeamLogoGet.as_view()),
    path("team/logo/image/<str:team_code>/", views.TeamLogoProxy.as_view()),
    path("team/create/", views.TeamCreate.as_view()),
    path("team/update/", views.TeamUpdate.as_view()),
    path("team/my-team/", views.MyTeamInfo.as_view()),
    path("team/members/", views.TeamMembersList.as_view()),
    path("team/member/number/", views.TeamMemberNumberUpdate.as_view()),
    path("team/member/role/", views.TeamMemberRoleUpdate.as_view()),
    path("team/matches/", views.TeamMatchList.as_view()),
    # 관리자 관련 API
    path("admin/login/", views.AdminLogin.as_view()),
    path("admin/customer-types/", views.Get_CustomerType_Users.as_view()),
    path("admin/test-login/", views.TestUserLogin.as_view()),
    # 관리자 컨텐츠 관리 API
    path("admin/content/create/", views.AdminContentCreate.as_view()),
    path("admin/content/update/", views.AdminContentUpdate.as_view()),
    path("admin/content/delete/", views.AdminContentDelete.as_view()),
    path("admin/inquiry/list/", views.AdminInquiryList.as_view()),
    path("admin/inquiry/answer/", views.AdminInquiryAnswer.as_view()),
    path("admin/logs/query/", views.AdminLogsQuery.as_view()),
    # Content Board API
    path("content/notice/list/", views.NoticeList.as_view()),
    path("content/event/list/", views.EventList.as_view()),
    path("content/inquiry/list/", views.InquiryList.as_view()),
    path("content/detail/", views.ContentDetail.as_view()),
    path("content/inquiry/create/", views.InquiryCreate.as_view()),
    path("content/comment/create/", views.CommentCreate.as_view()),
    path("content/comment/delete/", views.CommentDelete.as_view()),
    path("content/like/toggle/", views.LikeToggle.as_view()),
    # 알림 관련 API
    path("notification/list/", views.NotificationList.as_view()),
    path("notification/mark-read/", views.NotificationMarkAsRead.as_view()),
    path("notification/mark-all-read/", views.NotificationMarkAllAsRead.as_view()),
]