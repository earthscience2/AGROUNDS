from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TestAnalyzeData
from .serializers import *
from staticfiles.makeFileKey import *

class aiSummation(APIView):
    def post(self, request):
        data = request.data
        match_code = data.get('match_code')
        user_code = data.get('user_code')

        if not match_code or not user_code:
            raise serializers.ValidationError("match_code와 user_code가 필요합니다.")

        try:
            match = TestAnalyzeData.objects.get(match_code=match_code, user_code=user_code, quarter=1)
            
            serializer = MatchAnalyzeSerializer(match)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except TestAnalyzeData.DoesNotExist:
                raise serializers.ValidationError(f"매치 코드 {match_code}, 유저코드 {user_code}에 해당하는 데이터가 존재하지 않습니다.")

class analyzeData(APIView):
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