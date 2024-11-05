from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TestAnalyzeData
from .serializers import *
from staticfiles.make_file_key import *

class aiSummation(APIView):
    '''
        경기별 ai 요약 불러오기 (전체/공격/수비)

        필요한 데이터 :
        {
            match_code : [매치코드],
            user_code : [유저코드]
        }

        리턴하는 값 예시 :
        {
            "total": "지난 경기에서는 선수분이 정말 열심히 뛰어주셨고...",
            "attack": "공격 측면에서는 1쿼터 동안 1.41km를 뛰며 12분 동안 공격에 집중... ",
            "defense": "수비 쪽에서도 꾸준한 모습을 보여..."
        }
    '''
    def post(self, request):
        data = request.data
        match_code = data.get('match_code')
        user_code = data.get('user_code')

        if not match_code or not user_code:
            raise serializers.ValidationError("match_code와 user_code가 필요합니다.")

        try:
            match = TestAnalyzeData.objects.get(match_code=match_code, user_code=user_code)
            
            serializer = MatchAnalyzeSerializer(match)
            return Response(serializer.data["ai_summation"], status=status.HTTP_200_OK)
        
        except TestAnalyzeData.DoesNotExist:
                raise serializers.ValidationError(f"매치 코드 {match_code}, 유저코드 {user_code}에 해당하는 데이터가 존재하지 않습니다.")

class analyzeData(APIView):
    '''
        쿼터별 경기결과 불러오기 (전체/공격/수비)

        필요한 데이터 :
        {
            match_code : [매치코드],
            user_code : [유저코드],
            quater : [쿼터번호]
        }

        리턴하는 값 예시 :
        {
            "total": {
                "hitmap": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_total_TI_H.png",
                "high_speed_hitmap": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_total_TI_HH.png",
                "change_direction": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_total_direction.png",
                "speed_change": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_speed.png",
                "acceleration_change": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_acceleration.png",
                "T": 23,
                "D": 2.52,
                "DPM": 109.46,
                "LDT": 26,
                "HDT": 6,
                "MR": 22.41,
                "AS": 6.57,
                "HS": 31.26,
                "AA": 1.67,
                "HA": 15.89,
                "S": 9,
                "ASD": 15.65,
                "ASS": 22.38,
                "ASA": 2.26,
                "TSD": 140.83,
                "HSD": 32.39,
                "LSD": 5.87,
                "SDPD": 5.59
            },
            "attack": {
                "hitmap": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_attack_AI_H.png",
                "high_speed_hitmap": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_attack_AI_HH.png",
                "change_direction": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_attack_direction.png",
                "speed_change": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_speed.png",
                "acceleration_change": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_acceleration.png",
                "T": 7,
                "D": 0.9,
                "DPM": 113.37,
                "LDT": 9,
                "HDT": 1,
                "MR": 15.83,
                "AS": 6.8,
                "HS": 25.48,
                "AA": 1.76,
                "HA": 10.96,
                "S": 4,
                "ASD": 13.39,
                "ASS": 21.74,
                "ASA": 2.57,
                "TSD": 53.55,
                "HSD": 20.95,
                "LSD": 5.87,
                "SDPD": 5.98
            },
            "defense": {
                "hitmap": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_defense_DI_H.png",
                "high_speed_hitmap": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_defense_DI_HH.png",
                "change_direction": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_defense_direction.png",
                "speed_change": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_speed.png",
                "acceleration_change": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/gps/JJJJJJ_20241017_1/img/1쿼터_acceleration.png",
                "T": 15,
                "D": 1.62,
                "DPM": 107.41,
                "LDT": 17,
                "HDT": 5,
                "MR": 24.11,
                "AS": 6.44,
                "HS": 31.26,
                "AA": 1.62,
                "HA": 15.89,
                "S": 5,
                "ASD": 17.46,
                "ASS": 22.89,
                "ASA": 2.01,
                "TSD": 87.28,
                "HSD": 32.39,
                "LSD": 7.61,
                "SDPD": 5.38
            },
            "replay_video": "아직 준비되지 않음."
        }
    '''
    def post(self, request) : 
        data = request.data
        match_code = data.get('match_code')
        user_code = data.get('user_code')
        quarter = data.get('quarter')

        if not match_code or not user_code or not quarter:
            raise serializers.ValidationError("match_code와 user_code, quarter가 필요합니다.")

        try:
            match = TestAnalyzeData.objects.get(match_code=match_code, user_code=user_code)
            if int(quarter) > match.quarter or int(quarter) < 1:
                raise serializers.ValidationError("quarter가 범위 밖입니다.")
            
            bucket_name = 'aground-aisdfis'
            file_key = makeResultJsonKey(match.user_id, match.match_date, match.match_number)

            reader = S3TxtFileReader(bucket_name)
            file_content = reader.read(file_key)
            json_data = json.loads(file_content) if file_content else {}
            json_data = json_data[f'{quarter}쿼터']

            fields_to_extract = [
                 "T", "D", "DPM", "LDT", "HDT", "MR", "AS", "HS",
                 "AA", "HA", "S", "ASD", "ASS", "ASA", "TSD", "HSD",
                 "LSD", "SDPD"
                 ]
            sections_to_process = ["total", "attack", "defense"]
            
            # Initialize an empty dictionary for filtered data
            filtered_data = {}
            
            # Iterate over each section and field to extract the needed data
            for section in sections_to_process:
                if section not in json_data:
                    continue
                filtered_data[section] = {}
                filtered_data[section]["hitmap"] = getHitmapUrl(match.user_id, match.match_date, match.match_number, quarter, section)
                filtered_data[section]["high_speed_hitmap"] = getHighSpeedHitmapUrl(match.user_id, match.match_date, match.match_number, quarter, section)
                filtered_data[section]["change_direction"] = getChangeDirectionUrl(match.user_id, match.match_date, match.match_number, quarter, section)
                filtered_data[section]["speed_change"] = getSpeedChangeUrl(match.user_id, match.match_date, match.match_number, quarter)
                filtered_data[section]["acceleration_change"] = getAccelerationChangeUrl(match.user_id, match.match_date, match.match_number, quarter)

                section_id = ""
                if section == "total" :
                        section_id = "T"
                elif section == "attack" :
                        section_id = "A"
                else :
                    section_id = "D"
                for field in fields_to_extract:
                    if section_id+"_"+field in json_data[section]:
                        filtered_data[section][field] = json_data[section][section_id+"_"+field]
            filtered_data["replay_video"] = "아직 준비되지 않음."
            

            return Response(filtered_data, status=status.HTTP_200_OK)
        
        except TestAnalyzeData.DoesNotExist:
                raise serializers.ValidationError(f"매치 코드 {match_code}, 유저코드 {user_code}에 해당하는 데이터가 존재하지 않습니다.")

class playerReplayVideo(APIView):
    '''
        모든 쿼터의 개인 리플레이 영상 url 불러오기

        필요한 데이터 :
        {
            match_code : [매치코드],
            user_code : [유저코드]
        }

        리턴하는 값 예시 :
        {
            "quarter_1": {
                "pc": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/1쿼터/player_pc/AAAAAA_20241017_1_pc/AAAAAA_20241017_1_pc.mpd",
                "mobile": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/1쿼터/player_pc/AAAAAA_20241017_1_pc/AAAAAA_20241017_1_pc.mpd"
            },
            "quarter_2": {
                "pc": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/2쿼터/player_pc/AAAAAA_20241017_1_pc/AAAAAA_20241017_1_pc.mpd",
                "mobile": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/2쿼터/player_pc/AAAAAA_20241017_1_pc/AAAAAA_20241017_1_pc.mpd"
            },
            "quarter_3": {
                "pc": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/3쿼터/player_pc/AAAAAA_20241017_1_pc/AAAAAA_20241017_1_pc.mpd",
                "mobile": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/3쿼터/player_pc/AAAAAA_20241017_1_pc/AAAAAA_20241017_1_pc.mpd"
            }
        }
    '''
    def post(self, request):
        data = request.data
        match_code = data.get('match_code')
        user_code = data.get('user_code')
        
        if not match_code or not user_code:
            raise serializers.ValidationError("match_code와 user_code, quarter가 필요합니다.")

        try:
            match = TestAnalyzeData.objects.get(match_code=match_code, user_code=user_code)

            urls = {}
            for i in range(match.quarter) : 
                urls[f"quarter_{i+1}"] = {
                     "pc" : getPlayerReplayUrl("pc", match.match_code, match.user_id, match.match_date, match.match_number, i+1),
                     "mobile" : getPlayerReplayUrl("mobile", match.match_code, match.user_id, match.match_date, match.match_number, i+1)
                }

            return Response(urls, status=status.HTTP_200_OK)
            
        except TestAnalyzeData.DoesNotExist:
                raise serializers.ValidationError(f"매치 코드 {match_code}, 유저코드 {user_code}에 해당하는 데이터가 존재하지 않습니다.")

class teamReplayVideo(APIView):
    '''
        모든 쿼터의 팀 리플레이 영상 url 불러오기

        필요한 데이터 :
        {
            match_code : [매치코드],
        }

        리턴하는 값 예시 :
        {
            "quarter_1": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/1쿼터/team/team.mpd",
            "quarter_2": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/2쿼터/team/team.mpd",
            "quarter_3": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/3쿼터/team/team.mpd"
        }
    '''
    def post(self, request):
        data = request.data
        match_code = data.get('match_code')

        try:
            match = TestAnalyzeData.objects.filter(match_code=match_code).first()

            urls = {}
            for i in range(match.quarter) : 
                urls[f"quarter_{i+1}"] = getTeamReplayUrl(match.match_code, match.match_date, i+1)

            return Response(urls, status=status.HTTP_200_OK)

        except TestAnalyzeData.DoesNotExist:
            raise serializers.ValidationError(f"매치 코드 {match_code}에 해당하는 데이터가 존재하지 않습니다.")

class fullReplayVideo(APIView):
    '''
        모든 쿼터의 full 리플레이 영상 url 불러오기

        필요한 데이터 :
        {
            match_code : [매치코드],
        }

        리턴하는 값 예시 :
        {
            "quarter_1": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/1쿼터/full/full.mpd",
            "quarter_2": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/2쿼터/full/full.mpd",
            "quarter_3": "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/3쿼터/full/full.mpd"
        }
    '''
    def post(self, request):
        data = request.data
        match_code = data.get('match_code')

        try:
            match = TestAnalyzeData.objects.filter(match_code=match_code).first()

            urls = {}
            for i in range(match.quarter) : 
                urls[f"quarter_{i+1}"] = getFullReplayUrl(match.match_code, match.match_date, i+1)

            return Response(urls, status=status.HTTP_200_OK)

        except TestAnalyzeData.DoesNotExist:
            raise serializers.ValidationError(f"매치 코드 {match_code}에 해당하는 데이터가 존재하지 않습니다.")