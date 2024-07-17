from django.shortcuts import render
# 함수추가 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from .models import User_info
from DB.models import V2_TeamInfo
from PIL import Image
from DB.forms import ImageUploadForm
from .serializers import *
from staticfiles.image_uploader import S3ImgUploader

## V2_team 전체 DB정보
class V2_TeamMainAPI(APIView):
    def get(self, request):
        team_info = V2_TeamInfo.objects.all()
        serializer = Team_main_page(team_info, many=True)
        return Response(serializer.data)

## V2_team 팀 생성 
class V2_TeamMakeTeamAPI(APIView):
    """
    json 형식
    {
    "v2_team_host" : "u_1sa95ior6ijpr",
    "v2_team_logo": "asdfasfd",
    "v2_team_name": "test"
    }
    """
    def post(self, request, *args, **kwargs):
        # form = ImageUploadForm(request.POST, request.FILES)
        logo = request.FILES.get('v2_team_logo')
        request_data = request.data.copy()
        uploader = None

        # if form.is_valid():
        if logo is not None:
                # 파일 객체 추출
                # image = form.cleaned_data['v2_team_logo']
                try:
                    image = Image.open(logo)
                    image.verify()
                except (IOError, SyntaxError) as e:
                    return Response({"error": "Invalid image file"}, status=status.HTTP_400_BAD_REQUEST)
                # uploader 객체 생성, url 추출
                uploader = S3ImgUploader(logo)
                filename = uploader.filename
        else : 
            return Response('팀로고 : 파일 업로드 실패.', status=status.HTTP_400_BAD_REQUEST)

        request_data['v2_team_logo'] = filename

        serializer = Team_info_Serializer(data=request_data)

        if serializer.is_valid():
            # 모든 값이 유효하면 이미지 업로드 수행
            if uploader is not None:
                try:
                    uploader.upload()
                except ValueError as e:
                    return Response({"error": f"fail to upload file : {e}"}, status=status.HTTP_400_BAD_REQUEST)
                except Exception as e:
                    return Response({"error": f"fail to upload file : {e}"}, status=status.HTTP_400_BAD_REQUEST)
                serializer.save()
                return Response(serializer.data)
            else:
                return Response('팀로고 : 파일 업로드 실패. uploader가 None입니다.', status=status.HTTP_400_BAD_REQUEST)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


## V2_team 업데이트 
class V2_TeamUpdateTeamAPI(APIView):
    """
    json 형식
    {
    "v2_team_code":"t_610t7o2eh77eu",
    "v2_team_logo": "asdfasfd",
    "v2_team_name": "test",
    "v2_team_players": ["규성", "니니니"]
    }
    """
    # 여기서 v2_team_code는 user_code를 타고 가서 그때의 team_code를 불러와서 팀 수정
    def patch(self, request, *args, **kwargs):
        v2_team_code = request.data.get('v2_team_code')
        try:
            v2_team_info = V2_TeamInfo.objects.get(v2_team_code=v2_team_code)
        except TeamInfo.DoesNotExist:
            return Response({'error' : '해당 팀이 존재하지 않습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UpdateTeamInfoSerializer(v2_team_info, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # 유효성 검사 오류 메시지를 확인하여 반환합니다.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

## V2_team 검색 by Teamcode
class TeamSearchByTeamcodeAPI(APIView):
    '''
    {
    "v2_team_code": "t_610t7o2eh77eu"
    }
    '''
    def post(self, request):
        v2_team_code = request.data.get('v2_team_code')
        if not v2_team_code:
            return Response({'error': 'v2_team_code is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            team_info = V2_TeamInfo.objects.get(v2_team_code=v2_team_code)
        except V2_TeamInfo.DoesNotExist:
            return Response({'error': 'No team found with the provided team code.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TeamInfoIncludedPlayersNames(team_info)
        return Response(serializer.data)

## V2_team 검색 by Teamname
class TeamSearchByTeamnameAPI(APIView):
    '''
    {
    "v2_team_name": "땅"
    }
    '''
    def post(self, request):
        v2_team_name = request.data.get('v2_team_name')
        if not v2_team_name:
            return Response({'error': 'v2_team_name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        teams = V2_TeamInfo.objects.filter(v2_team_name__icontains=v2_team_name)
        if not teams.exists():
            return Response({'error': 'No teams found with the provided name.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TeamInfoIncludedPlayersNames(teams, many=True)
        return Response(serializer.data)
    
## V2_team에 가입 
class V2_JoinTeamAPI(APIView):
    '''
    팀 가입 api
    {
    "user_code" : "u_1sa95ior6ijpr"
    "team_code" : "t_1sa95sa10rmdrs"
    }
    '''
    def post(self, request):
        user_code = request.data.get('user_code')
        team_code = request.data.get('team_code')
        if not user_code:
            return Response({'error': 'user_code is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not team_code:
            return Response({'error': 'team_code is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            v2_user_info = V2_UserInfo.objects.get(user_code = user_code)
        except V2_UserInfo.DoesNotExist:
            Response({'error' : '해당 유저가 존재하지 않습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            v2_team_info = V2_TeamInfo.objects.get(v2_team_code = team_code)
        except V2_TeamInfo.DoesNotExist:
            Response({'error' : '해당 팀이 존재하지 않습니다.'}, status=status.HTTP_400_BAD_REQUEST)

        user_info_serializer = V2_UpdateUserInfoSerializer(v2_user_info, data={'team_code' : team_code, 'user_type' : 1}, partial=True)
        team_info_serializer = UpdateTeamInfoSerializer(v2_team_info, data={'v2_team_players' : [user_code]}, partial=True)

        # 유효성 검사 후 .save() 실행
        if user_info_serializer.is_valid():
            user_info_serializer.save()
        else:
            return Response(user_info_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if team_info_serializer.is_valid():
            team_info_serializer.save()
        else:
            return Response(team_info_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message' : '팀 가입에 성공했습니다.'})
    

## 개인회원 가입 API
class V2_JoinPersonalAPI(APIView):
    '''
    개인 가입 api
    {
    "user_code" : "u_1sa95ior6ijpr"
    }
    '''
    def post(self, request):
        user_code = request.data.get('user_code')

        if not user_code:
            return Response({'error': 'user_code is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            v2_user_info = V2_UserInfo.objects.get(user_code=user_code)
        except V2_UserInfo.DoesNotExist:
            return Response({'error': '해당 유저가 존재하지 않습니다.'}, status=status.HTTP_400_BAD_REQUEST)

        v2_user_info.user_type = 2
        v2_user_info.save()

        return Response({'message': '개인 가입에 성공했습니다.'})

## 회원 키몸무게 정보 업데이트 
class V2_HeWeight(APIView):
    '''
    개인 가입 api
    {
    "user_code" : "u_1sa95ior6ijpr",
    "user_weight" : 74,
    "user_height" : 180,
    "user_position" : "ST"
    }
    '''
    def post(self, request):
        user_code = request.data.get('user_code')
        user_weight = request.data.get('user_weight')
        user_height = request.data.get('user_height')
        user_position = request.data.get('user_position')

        if not user_code:
            return Response({'error': 'user_code is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not user_weight:
            return Response({'error': 'user_weight is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not user_height:
            return Response({'error': 'user_height is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not user_position:
            return Response({'error': 'user_position is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            v2_user_info = V2_UserInfo.objects.get(user_code=user_code)
            
        except V2_UserInfo.DoesNotExist:
            return Response({'error': '해당 유저가 존재하지 않습니다.clear'}, status=status.HTTP_400_BAD_REQUEST)

        # user_weight와 user_height 값을 설정
        
        v2_user_info.user_height = user_height
        v2_user_info.user_weight = user_weight
        v2_user_info.user_position = user_position
        v2_user_info.save()

        return Response({'message': '키 몸무게 정보가 입력되었습니다.'})