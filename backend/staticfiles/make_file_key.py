base = "https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com"

def getQurterName(num_of_quarter, quarter):
    if num_of_quarter == 2 :
        if(quarter == 1) :
            return "전반전"
        else :
            return "후반전"
    else :
        return f"{quarter}쿼터"

def makeGpsMatchDir(user_id, match_code, match_date, match_number):
    return f"demo/gps/{match_date}_{match_code}/{user_id}_{match_date}_{match_number}"

def makeGptJosnKey(user_id, match_code, match_date, match_number):
    file_key = f"{makeGpsMatchDir(user_id, match_code, match_date, match_number)}/gpt.json"
    return file_key

def makeResultJsonKey(user_id, match_code, match_date, match_number):
    file_key = f"{makeGpsMatchDir(user_id, match_code, match_date, match_number)}/result.json"
    return file_key

def getHitmapUrl(user_id, match_code, match_date, match_number, quarter_name, section):
    file_url = f"{base}/{makeGpsMatchDir(user_id, match_code, match_date, match_number)}/img/{quarter_name}_{section}_"
    if(section == "total"):
        file_url += "TI_H.png"
    elif(section == "attack"):
        file_url += "AI_H.png"
    else:
        file_url += "DI_H.png"
    return file_url

def getHighSpeedHitmapUrl(user_id, match_code, match_date, match_number, quarter_name, section):
    file_url = f"{base}/{makeGpsMatchDir(user_id, match_code, match_date, match_number)}/img/{quarter_name}_{section}_"
    if(section == "total"):
        file_url += "TI_HH.png"
    elif(section == "attack"):
        file_url += "AI_HH.png"
    else:
        file_url += "DI_HH.png"
    return file_url

def getChangeDirectionUrl(user_id, match_code, match_date, match_number, quarter_name, section):
    file_url = f"{base}/{makeGpsMatchDir(user_id, match_code, match_date, match_number)}/img/{quarter_name}_{section}_direction.png"
    return file_url

def getAccelerationChangeUrl(user_id, match_code, match_date, match_number, quarter_name):
    file_url = f"{base}/{makeGpsMatchDir(user_id, match_code, match_date, match_number)}/img/{quarter_name}_acceleration.png"
    return file_url

def getSpeedChangeUrl(user_id, match_code, match_date, match_number, quarter_name):
    file_url = f"{base}/{makeGpsMatchDir(user_id, match_code, match_date, match_number)}/img/{quarter_name}_speed.png"
    return file_url

# 영상

def getPlayerReplayUrl(type, match_code, user_id, match_date, match_number, quarter):
    file_url = f"{base}/demo/video/{match_date}_{match_code}/{quarter}쿼터/player_{type}/{user_id}_{match_date}_{match_number}_{type}/{user_id}_{match_date}_{match_number}_{type}.mpd"
    return file_url

def getPlayerReplayDownloadUrl(type, match_code, user_id, match_date, match_number, quarter):
    file_url = f"{base}/demo/video/{match_date}_{match_code}/{quarter}쿼터/player_{type}/{user_id}_{match_date}_{match_number}_{type}.mp4"
    return file_url

def getTeamReplayUrl(match_code, match_date, quarter):
    file_url = f"{base}/demo/video/{match_date}_{match_code}/{quarter}쿼터/team/team.mpd"
    return file_url

def getTeamReplayDownloadUrl(match_code, match_date, quarter):
    file_url = f"{base}/demo/video/{match_date}_{match_code}/{quarter}쿼터/team.mp4"
    return file_url

def getFullReplayUrl(match_code, match_date, quarter):
    file_url = f"{base}/demo/video/{match_date}_{match_code}/{quarter}쿼터/full/full.mpd"
    return file_url

def getFullReplayDownloadUrl(match_code, match_date, quarter):
    file_url = f"{base}/demo/video/{match_date}_{match_code}/{quarter}쿼터/full.mp4"
    return file_url