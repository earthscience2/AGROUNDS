from staticfiles.get_file_url import get_file_url

def get_link(video_info, quarter_name):
        path = video_info.path

        if path is not None:
            if path.startswith("http"):
                return path
            elif path != '':
                return get_file_url(path)
        
        if video_info.type == 'player':
            return get_file_url(f'video/{video_info.match_code}/{quarter_name}/player_pc/{video_info.user_code}/{video_info.user_code}.mpd')
        else :
            return get_file_url(f'video/{video_info.match_code}/{quarter_name}/{video_info.type}/{video_info.type}.mpd')

def get_download_link(video_info, quarter_name): 
    if video_info.type == 'player':
        return get_file_url(f'video/{video_info.match_code}/{quarter_name}/player_pc/{video_info.user_code}.mp4/')
    else :
        return get_file_url(f'video/{video_info.match_code}/{quarter_name}/{video_info.type}.mp4')


def makeGpsMatchDir(match_code, user_code):
    return f"gps/{match_code}/{user_code}"

def makeGptJosnKey(match_code, user_code):
    file_key = f"{makeGpsMatchDir(match_code, user_code)}/gpt.json"
    return file_key

def makeResultJsonKey(match_code, user_code, quarter_name):
    file_key = f"{makeGpsMatchDir(match_code, user_code)}/{quarter_name}_result.json"
    return file_key

def getHitmapUrl(match_code, user_code, quarter_name, section):
    file_url = get_file_url(f"{makeGpsMatchDir(match_code, user_code)}/img/{quarter_name}_{section}_")
    if(section == "total"):
        file_url += "T_H_L.png"
    elif(section == "attack"):
        file_url += "A_H_L.png"
    elif(section == "defense"):
        file_url += "D_H_L.png"
    return file_url

def getHighSpeedHitmapUrl(match_code, user_code, quarter_name, section):
    file_url = get_file_url(f"{makeGpsMatchDir(match_code, user_code)}/img/{quarter_name}_{section}_")
    if(section == "total"):
        file_url += "TI_HH.png"
    elif(section == "attack"):
        file_url += "AI_HH.png"
    else:
        file_url += "DI_HH.png"
    return file_url

def getSprintMapUrl(match_code, user_code, quarter_name):
    file_url = get_file_url(f"{makeGpsMatchDir(match_code, user_code)}/img/{quarter_name}_sprint.png")
    return file_url

def getChangeDirectionUrl(match_code, user_code, quarter_name, section):
    file_url = get_file_url(f"{makeGpsMatchDir(match_code, user_code)}/img/{quarter_name}_{section}_direction.png")
    return file_url

def getAccelerationChangeUrl(match_code, user_code, quarter_name, section):
    file_url = get_file_url(f"{makeGpsMatchDir(match_code, user_code)}/img/{quarter_name}_acceleration.png")
    return file_url

def getSpeedChangeUrl(match_code, user_code, quarter_name, section):
    file_url = get_file_url(f"{makeGpsMatchDir(match_code, user_code)}/img/{quarter_name}_speed.png")
    return file_url

# 영상

def getPlayerReplayUrl(type, match_code, user_id, match_date, match_number, quarter):
    file_url = get_file_url(f"demo/video/{match_date}_{match_code}/{quarter}쿼터/player_{type}/{user_id}_{match_date}_{match_number}_{type}/{user_id}_{match_date}_{match_number}_{type}.mpd")
    return file_url

def getPlayerReplayDownloadUrl(type, match_code, user_id, match_date, match_number, quarter):
    file_url = get_file_url(f"demo/video/{match_date}_{match_code}/{quarter}쿼터/player_{type}/{user_id}_{match_date}_{match_number}_{type}.mp4")
    return file_url

def getTeamReplayUrl(match_code, match_date, quarter):
    file_url = get_file_url(f"demo/video/{match_date}_{match_code}/{quarter}쿼터/team/team.mpd")
    return file_url

def getTeamReplayDownloadUrl(match_code, match_date, quarter):
    file_url = get_file_url(f"demo/video/{match_date}_{match_code}/{quarter}쿼터/team.mp4")
    return file_url

def getFullReplayUrl(match_code, match_date, quarter):
    file_url = get_file_url(f"demo/video/{match_date}_{match_code}/{quarter}쿼터/full/full.mpd")
    return file_url

def getFullReplayDownloadUrl(match_code, match_date, quarter):
    file_url = get_file_url(f"demo/video/{match_date}_{match_code}/{quarter}쿼터/full.mp4")
    return file_url