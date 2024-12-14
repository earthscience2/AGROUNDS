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
from login.serializers import Essecial_User_Info
from staticfiles.image_uploader import S3ImgUploader

class makeTeam(APIView):
    def post(self, request):
        request_data = request.data.copy()
        logo = request.FILES.get('team_logo')
        uploader = None

        # 먼저 파일 이름을 생성
        if logo is not None:
            try:
                image = Image.open(logo)
                image.verify()
            except (IOError, SyntaxError) as e:
                return Response({"error": "Invalid image file"}, status=status.HTTP_400_BAD_REQUEST)
            # uploader 객체 생성, url 추출
            filedir = "img/teamlogo/"
            uploader = S3ImgUploader(logo, filedir)
            filename = uploader.filename
        else : 
            filename = 'img/teamlogo/default-team-logo.png'
        
        request_data['v2_team_logo'] = filename

        serializer = Team_Info_Serializer(data=request_data)

        if serializer.is_valid():
            # logo file이 들어왔다면, 이미지 업로드 수행
            if uploader is not None:
                try:
                    uploader.upload()
                except Exception as e:
                    return Response({"error": f"fail to upload file : {e}"}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response({"result" : "success"})
        else:
            # 유효성 검사 오류 메시지
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class getTeamInfo(APIView):
    def post(self, request):
        data = request.data
        try:
            team_code = data['team_code']
            teamInfo = TeamInfo.objects.get(team_code=team_code)
        except KeyError as e :
            return JsonResponse({"error": f"Missing required field: {str(e)}"}, status=400)
        except TeamInfo.DoesNotExist :
            return JsonResponse({"error": "team_code에 해당하는 팀이 존재하지 않습니다."}, status=400)
        
        serializer = Team_Info_Serializer(teamInfo)

        return Response(serializer.data)
    
class searchTeamByName(APIView):
    def post(self, request):
        team_name = request.data.get('team_name')
        if not team_name:
            return Response({'error': 'Missing required field: team_name'}, status=400)

        teams = TeamInfo.objects.filter(team_name__icontains=team_name)
        if not teams.exists():
            return Response({'error': 'No teams found with the provided name.'}, status=404)

        serializer = Team_Info_Serializer(teams, many=True)
        return Response({"result" : serializer.data})
    
class getTeamPlayerList(APIView):
    def post(self, request):
        team_code = request.data.get('team_code')
        if not team_code:
            return Response({'error': 'Missing required field: team_code'}, status=400)
        
        try:
            # 팀에 소속된 유저들의 정보를 가져오기
            user_codes = UserTeam.objects.filter(team_code=team_code).values_list('user_code', flat=True)

            players = UserInfo.objects.filter(user_code__in=user_codes)

            if not players.exists():
                return Response({'message': 'No players found for this team'}, status=404)
            
            serializer = Essecial_User_Info(players, many=True)

            return Response({'result' : serializer.data}, status=200)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class invitePlayer(APIView):
    def post(self, request):
        team_code = request.data.get('team_code')
        user_code = request.data.get('user_code')
        if not team_code:
            return Response({'error': 'Missing required field: team_code'}, status=400)
        if not user_code:
            return Response({'error': 'Missing required field: user_code'}, status=400)
        
        serializer = User_Team_Serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            pending_invite_teams = PendingInviteTeam.objects.filter(user_code=user_code)
            # 유저가 팀 가입 신청을 걸어 놓은 상태라면, 모든 요청들을 삭제
            if pending_invite_teams.exists():
                pending_invite_teams.delete()

            return Response({"result" : "success"})
        else:
            return Response(serializer.errors, status=400)

class acceptPlayer(APIView):
    def post(self, request):
        data = request.data.copy()

        required_fields = ['team_code', 'user_code', 'accept']
        errors = {field: f"{field}는 필수 항목입니다." for field in required_fields if field not in data}
        if errors:
            return Response(errors, status=400)

        pending_invite_team = PendingInviteTeam.objects.filter(team_code = data['team_code'], user_code = data['user_code']).first()
        if pending_invite_team is None:
            return Response({"error" : f"해당 요청이 존재하지 않습니다. : {data['user_code']} to {data['team_code']}"})
        
        pending_invite_teams = PendingInviteTeam.objects.filter(user_code = data['user_code'])

        if data['accept'] == 'true' :
            data.pop('accept')
            serializer = User_Team_Serializer(data=data)
            if serializer.is_valid():
                serializer.save()

                # 가입 승인시 해당 유저의 모든 가입 요청 삭제
                pending_invite_teams.delete()
                return Response({"result" : "accepted"}, status=200)
            else:
                return Response(serializer.errors, status=400)
        else:
            # 가입 거절 시 해당 유저의 해당 가입 요청만 삭제
            pending_invite_team.delete()
            return Response({"result": "denied"}, status=200)