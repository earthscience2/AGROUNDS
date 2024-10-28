base = "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com"

def makeGptJosnKey(user_id, match_date, match_number):
    file_key = f"demo/gps/{user_id}_{match_date}_{match_number}/gpt.json"
    return file_key

def makeResultJsonKey(user_id, match_date, match_number):
    file_key = f"demo/gps/{user_id}_{match_date}_{match_number}/result.json"
    return file_key

def getHitmapUrl(user_id, match_date, match_number, quarter, section):
    file_url = f"{base}/demo/gps/{user_id}_{match_date}_{match_number}/img/{quarter}쿼터_{section}_"
    if(section == "total"):
        file_url += "TI_H.png"
    elif(section == "attack"):
        file_url += "AI_H.png"
    else:
        file_url += "DI_H.png"
    return file_url

def getHighSpeedHitmapUrl(user_id, match_date, match_number, quarter, section):
    file_url = f"{base}/demo/gps/{user_id}_{match_date}_{match_number}/img/{quarter}쿼터_{section}_"
    if(section == "total"):
        file_url += "TI_HH.png"
    elif(section == "attack"):
        file_url += "AI_HH.png"
    else:
        file_url += "DI_HH.png"
    return file_url

def getChangeDirectionUrl(user_id, match_date, match_number, quarter, section):
    file_url = f"{base}/demo/gps/{user_id}_{match_date}_{match_number}/img/{quarter}쿼터_{section}_direction.png"
    return file_url

def getAccelerationChangeUrl(user_id, match_date, match_number, quarter):
    file_url = f"{base}/demo/gps/{user_id}_{match_date}_{match_number}/img/{quarter}쿼터_acceleration.png"
    return file_url

def getSpeedChangeUrl(user_id, match_date, match_number, quarter):
    file_url = f"{base}/demo/gps/{user_id}_{match_date}_{match_number}/img/{quarter}쿼터_speed.png"
    return file_url

def getPlayerReplayUrl(match_code, user_id, match_date, match_number, quarter):
    file_url = f"https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com/demo/video/20241017_m_001/1%EC%BF%BC%ED%84%B0/player_pc/AAAAAA_20241017_1_pc.mp4"