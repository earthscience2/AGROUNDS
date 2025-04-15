import re

def extract_video_id(url):
    """
    다양한 유튜브 URL로부터 영상 ID를 추출합니다.
    """
    # 유튜브 URL 패턴들
    regex_patterns = [
        r"(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|\&|$)",  # 일반 영상 링크, 공유 링크, 임베드 링크
        r"youtu\.be\/([0-9A-Za-z_-]{11})",          # youtu.be 단축 링크
        r"youtube\.com\/shorts\/([0-9A-Za-z_-]{11})", # Shorts 링크
    ]

    for pattern in regex_patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

def thumbnail_url(video_id, quality='maxresdefault'):
    if video_id is None:
        return None
    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/{quality}.jpg"
    return thumbnail_url