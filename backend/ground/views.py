from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from DB.models import GroundInfo, PlayerMatch, PlayerMatchCross, Upload
from django.db.models import Q
from django.conf import settings
import boto3
from botocore.exceptions import ClientError
import urllib.parse
import uuid
from datetime import datetime
import csv
import io
import math
import random
import string
from typing import List, Dict, Optional, Tuple

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


# ===============================================
# 유틸리티 함수
# ===============================================

def generate_ground_code():
    """
    경기장 코드 생성: g_ + 숫자+영어 10자리
    예: g_a3b5c7d9e1
    
    Returns:
        str: 생성된 경기장 코드
    """
    # 숫자와 소문자 영어를 섞어서 10자리 생성
    characters = string.ascii_lowercase + string.digits
    random_part = ''.join(random.choice(characters) for _ in range(10))
    return f"g_{random_part}"


# ===============================================
# 경기장 좌표 계산 함수
# ===============================================

def gps_to_utm(lat, lng, zone=52):
    """
    GPS 좌표를 UTM 좌표로 변환 (한국 UTM Zone 52N)
    
    Args:
        lat: 위도
        lng: 경도
        zone: UTM Zone (기본값: 52 - 한국)
    
    Returns:
        [easting, northing] 리스트
    """
    # WGS84 타원체 상수
    a = 6378137  # 장축
    f = 1 / 298.257223563  # 편평율
    k0 = 0.9996  # UTM 척도 계수
    e = math.sqrt(2 * f - f * f)
    e1sq = e * e / (1 - e * e)
    
    # 도를 라디안으로 변환
    lat_rad = lat * math.pi / 180
    lng_rad = lng * math.pi / 180
    
    # UTM Zone 52N의 중앙 경선 (129도)
    central_meridian = (zone - 1) * 6 - 180 + 3
    lng0_rad = central_meridian * math.pi / 180
    
    # 계산에 필요한 값들
    N = a / math.sqrt(1 - e * e * math.sin(lat_rad) ** 2)
    T = math.tan(lat_rad) ** 2
    C = e1sq * math.cos(lat_rad) ** 2
    A = (lng_rad - lng0_rad) * math.cos(lat_rad)
    
    # M 계산
    M = a * ((1 - e * e / 4 - 3 * e ** 4 / 64 - 5 * e ** 6 / 256) * lat_rad -
             (3 * e * e / 8 + 3 * e ** 4 / 32 + 45 * e ** 6 / 1024) * math.sin(2 * lat_rad) +
             (15 * e ** 4 / 256 + 45 * e ** 6 / 1024) * math.sin(4 * lat_rad) -
             (35 * e ** 6 / 3072) * math.sin(6 * lat_rad))
    
    # UTM 좌표 계산
    easting = k0 * N * (A + (1 - T + C) * A ** 3 / 6 +
                        (5 - 18 * T + T ** 2 + 72 * C - 58 * e1sq) * A ** 5 / 120) + 500000
    
    northing = k0 * (M + N * math.tan(lat_rad) * (A ** 2 / 2 +
                     (5 - T + 9 * C + 4 * C ** 2) * A ** 4 / 24 +
                     (61 - 58 * T + T ** 2 + 600 * C - 330 * e1sq) * A ** 6 / 720))
    
    return [round(easting, 6), round(northing, 6)]


def is_quadrilateral(points):
    """
    4개의 점이 유효한 사각형을 이루는지 확인
    
    Args:
        points: [[lat, lng], ...] 형식의 4개 점
    
    Returns:
        (bool, str): (유효 여부, 메시지)
    """
    if len(points) != 4:
        return False, "오류: 정확히 4개의 점이 필요합니다."
    
    # 각 점을 순서대로 연결하여 선분 생성
    segments = []
    for i in range(4):
        p1 = points[i]
        p2 = points[(i + 1) % 4]
        segments.append((p1, p2))
    
    def orientation(p, q, r):
        """세 점의 방향 계산 (시계방향, 반시계방향, 일직선)"""
        val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])
        if abs(val) < 1e-10:
            return 0  # 일직선
        return 1 if val > 0 else 2  # 시계방향 또는 반시계방향
    
    def on_segment(p, q, r):
        """q가 선분 pr 위에 있는지 확인"""
        return (q[0] <= max(p[0], r[0]) and q[0] >= min(p[0], r[0]) and
                q[1] <= max(p[1], r[1]) and q[1] >= min(p[1], r[1]))
    
    def do_segments_intersect(seg1, seg2):
        """두 선분이 교차하는지 확인"""
        p1, p2 = seg1
        p3, p4 = seg2
        
        o1 = orientation(p1, p2, p3)
        o2 = orientation(p1, p2, p4)
        o3 = orientation(p3, p4, p1)
        o4 = orientation(p3, p4, p2)
        
        # 일반적인 경우
        if o1 != o2 and o3 != o4:
            return True
        
        # 특수 경우 (일직선 상에 있는 경우)
        if o1 == 0 and on_segment(p1, p3, p2):
            return True
        if o2 == 0 and on_segment(p1, p4, p2):
            return True
        if o3 == 0 and on_segment(p3, p1, p4):
            return True
        if o4 == 0 and on_segment(p3, p2, p4):
            return True
        
        return False
    
    # 인접하지 않은 선분들이 교차하는지 확인
    if do_segments_intersect(segments[0], segments[2]) or do_segments_intersect(segments[1], segments[3]):
        return False, "오류: 점들이 사각형을 이루지 않습니다. 선분이 교차합니다."
    
    # 면적 계산 (Shoelace formula)
    area = 0
    for i in range(4):
        j = (i + 1) % 4
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]
    area = abs(area) / 2
    
    if area < 1e-10:
        return False, "오류: 점들이 거의 일직선 상에 있습니다."
    
    return True, "성공: 주어진 점들이 사각형을 이룹니다."


def euclidean_distance(p1, p2):
    """
    두 점 사이의 유클리드 거리 계산
    
    Args:
        p1: [x, y] 첫 번째 점
        p2: [x, y] 두 번째 점
    
    Returns:
        float: 유클리드 거리
    """
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)


def calc_ground(list_ground_gps, ground_name):
    """
    경기장 기본 정보 계산
    
    Args:
        list_ground_gps: [[lat, lng], ...] 형식의 4개 모서리 좌표
        ground_name: 경기장 이름
    
    Returns:
        dict: 경기장 정보
    """
    # GPS를 UTM으로 변환
    ground_gps_m = [gps_to_utm(lat, lon) for lat, lon in list_ground_gps]
    
    # 중심점 계산
    center = [
        round(sum(coord[0] for coord in ground_gps_m) / 4, 6),
        round(sum(coord[1] for coord in ground_gps_m) / 4, 6)
    ]
    
    # 각 변의 길이 계산
    distances = [euclidean_distance(ground_gps_m[i], ground_gps_m[(i + 1) % 4]) for i in range(4)]
    
    # 가장 긴 변 찾기
    longest_side_index = distances.index(max(distances))
    i = longest_side_index
    
    # 긴 변 (North/South 후보)
    side1_gps = [list_ground_gps[i], list_ground_gps[(i + 1) % 4]]
    side1_utm = [ground_gps_m[i], ground_gps_m[(i + 1) % 4]]
    side2_gps = [list_ground_gps[(i + 2) % 4], list_ground_gps[(i + 3) % 4]]
    side2_utm = [ground_gps_m[(i + 2) % 4], ground_gps_m[(i + 3) % 4]]
    
    # 누가 North/South인지 (위도 평균값 비교)
    side1_avg_lat = (side1_gps[0][0] + side1_gps[1][0]) / 2
    side2_avg_lat = (side2_gps[0][0] + side2_gps[1][0]) / 2
    if side1_avg_lat > side2_avg_lat:
        north_side_utm = side1_utm
        south_side_utm = side2_utm
    else:
        north_side_utm = side2_utm
        south_side_utm = side1_utm
    
    # 나머지 두 변 -> East/West 판단 (UTM easting 평균으로)
    short_side1_utm = [ground_gps_m[(i + 1) % 4], ground_gps_m[(i + 2) % 4]]
    short_side2_utm = [ground_gps_m[(i + 3) % 4], ground_gps_m[i]]
    avg_easting_side1 = (short_side1_utm[0][0] + short_side1_utm[1][0]) / 2
    avg_easting_side2 = (short_side2_utm[0][0] + short_side2_utm[1][0]) / 2
    if avg_easting_side1 < avg_easting_side2:
        west_side_utm = short_side1_utm
        east_side_utm = short_side2_utm
    else:
        west_side_utm = short_side2_utm
        east_side_utm = short_side1_utm
    
    # 인접한 변의 인덱스
    if longest_side_index == 0:
        adjacent_index = 1
    elif longest_side_index == 1:
        adjacent_index = 2
    elif longest_side_index == 2:
        adjacent_index = 3
    else:
        adjacent_index = 0
    
    long_side = distances[longest_side_index]
    short_side = distances[adjacent_index]
    
    new_long = [center[0] - (long_side / 2), center[0] + (long_side / 2)]
    new_short = [center[1] - (short_side / 2), center[1] + (short_side / 2)]
    
    data = {
        "ground_name": ground_name,
        "corner_gps": list_ground_gps,
        "corner_utm": ground_gps_m,
        "center": center,
        "long_side_length": round(distances[i], 6),
        "short_side_length": round(distances[(i + 1) % 4], 6),
        "new_short": new_short,
        "new_long": new_long,
        "north_side_utm": north_side_utm,
        "south_side_utm": south_side_utm,
        "east_side_utm": east_side_utm,
        "west_side_utm": west_side_utm,
    }
    return data


def rotate_point(pt, deg, center):
    """
    점을 중심점 기준으로 회전
    
    Args:
        pt: [x, y] 점 좌표
        deg: 회전 각도 (도)
        center: [cx, cy] 중심점
    
    Returns:
        (x, y): 회전된 점
    """
    rad = math.radians(deg)
    x, y = pt
    cx, cy = center
    x_shift = x - cx
    y_shift = y - cy
    x_rot = x_shift * math.cos(rad) - y_shift * math.sin(rad)
    y_rot = x_shift * math.sin(rad) + y_shift * math.cos(rad)
    return (x_rot + cx, y_rot + cy)


def orient_stadium(ground_data):
    """
    경기장 회전 후 모서리 좌표 계산
    
    Args:
        ground_data: calc_ground()의 반환값
    
    Returns:
        dict: 회전된 좌표 정보
    """
    cx, cy = ground_data["center"]
    
    # 남쪽 변 2점
    s0, s1 = ground_data["south_side_utm"]
    if s0[0] > s1[0]:
        s0, s1 = s1, s0
    dx = s1[0] - s0[0]
    dy = s1[1] - s0[1]
    slope_south = dy / dx if abs(dx) > 1e-9 else float('inf')
    angle_south_deg = math.degrees(math.atan(slope_south))
    
    # 회전각: 수평화 => -angle_south_deg
    rotate_deg = -angle_south_deg
    
    # 꼭짓점 전체 회전
    corners_before = ground_data["corner_utm"]
    corners_rotated = [rotate_point(pt, rotate_deg, (cx, cy)) for pt in corners_before]
    
    # 각 변도 회전
    def rotate_side(side_utm):
        return [rotate_point(pt, rotate_deg, (cx, cy)) for pt in side_utm]
    
    south_rot = rotate_side(ground_data["south_side_utm"])
    north_rot = rotate_side(ground_data["north_side_utm"])
    east_rot = rotate_side(ground_data["east_side_utm"])
    west_rot = rotate_side(ground_data["west_side_utm"])
    
    # South가 실제로 아래(더 작은 y) => 안 그러면 상하 뒤집기
    sy_avg = (south_rot[0][1] + south_rot[1][1]) / 2
    ny_avg = (north_rot[0][1] + north_rot[1][1]) / 2
    if sy_avg > ny_avg:
        corners_rotated = [(x, 2 * cy - y) for (x, y) in corners_rotated]
        south_rot = [(x, 2 * cy - y) for (x, y) in south_rot]
        north_rot = [(x, 2 * cy - y) for (x, y) in north_rot]
        east_rot = [(x, 2 * cy - y) for (x, y) in east_rot]
        west_rot = [(x, 2 * cy - y) for (x, y) in west_rot]
    
    # West가 실제 왼쪽 => 아니면 좌우 뒤집기
    wx_avg = (west_rot[0][0] + west_rot[1][0]) / 2
    ex_avg = (east_rot[0][0] + east_rot[1][0]) / 2
    if wx_avg > ex_avg:
        corners_rotated = [(2 * cx - x, y) for (x, y) in corners_rotated]
        south_rot = [(2 * cx - x, y) for (x, y) in south_rot]
        north_rot = [(2 * cx - x, y) for (x, y) in north_rot]
        east_rot = [(2 * cx - x, y) for (x, y) in east_rot]
        west_rot = [(2 * cx - x, y) for (x, y) in west_rot]
    
    return {
        "oriented_corners": corners_rotated,
        "oriented_north_side": north_rot,
        "oriented_south_side": south_rot,
        "oriented_east_side": east_rot,
        "oriented_west_side": west_rot
    }


def calculate_ground_info(corner_gps, ground_name):
    """
    경기장 전체 정보 계산 (메인 함수)
    
    Args:
        corner_gps: [[lat, lng], ...] 형식의 4개 모서리 좌표
        ground_name: 경기장 이름
    
    Returns:
        dict: 전체 경기장 정보
    """
    # 1) 사각형 유효성 검증
    is_valid, message = is_quadrilateral(corner_gps)
    if not is_valid:
        raise ValueError(message)
    
    # 2) 기본 정보 계산
    ground_data = calc_ground(corner_gps, ground_name)
    
    # 3) rotate_deg 계산 (North 변을 화면 위쪽 수평에 두려면 얼마 회전)
    nx0, ny0 = ground_data["north_side_utm"][0]
    nx1, ny1 = ground_data["north_side_utm"][1]
    cx, cy = ground_data["center"]
    dx = nx1 - nx0
    dy = ny1 - ny0
    
    if abs(dx) < 1e-9:
        slope_north = float('inf') if dy > 0 else float('-inf')
    else:
        slope_north = dy / dx
    
    angle_north = math.degrees(math.atan(slope_north))
    rotate_deg = -angle_north
    
    mid_x = (nx0 + nx1) / 2
    mid_y = (ny0 + ny1) / 2
    if mid_y < cy:
        rotate_deg += 180
    
    ground_data["rotate_deg"] = round(rotate_deg, 6)
    
    # 4) 회전 후 좌표 계산
    oriented_data = orient_stadium(ground_data)
    
    # 5) 최종 데이터 구성
    result = {
        "ground_name": ground_data["ground_name"],
        "corner_gps": ground_data["corner_gps"],
        "corner_utm": ground_data["corner_utm"],
        "center": ground_data["center"],
        "long_side_length": ground_data["long_side_length"],
        "short_side_length": ground_data["short_side_length"],
        "rotate_deg": ground_data["rotate_deg"],
        "rotated_corners": oriented_data["oriented_corners"],
        "new_long": ground_data["new_long"],
        "new_short": ground_data["new_short"],
        "north_side_utm": ground_data["north_side_utm"],
        "south_side_utm": ground_data["south_side_utm"],
        "east_side_utm": ground_data["east_side_utm"],
        "west_side_utm": ground_data["west_side_utm"]
    }
    
    return result


# ===============================================
# GroundFinder 클래스 (GPS 파일 분석)
# ===============================================

class GroundFinder:
    """GPS 파일을 분석하여 가장 가까운 경기장을 찾는 클래스"""
    
    def __init__(self):
        self.distance_threshold = 0.01  # 약 1km 정도의 임계값
    
    def parse_csv_file(self, file_content: str) -> List[Dict[str, float]]:
        """
        CSV 파일 내용을 파싱하여 GPS 좌표 리스트를 반환
        
        Args:
            file_content: CSV 파일의 문자열 내용
            
        Returns:
            GPS 좌표 딕셔너리 리스트 [{'lat': float, 'lng': float}, ...]
        """
        coordinates = []
        
        try:
            # CSV 파일 파싱
            csv_reader = csv.reader(io.StringIO(file_content))
            
            # 헤더 건너뛰기 (첫 번째 줄이 헤더인 경우)
            header = next(csv_reader, None)
            if header:
                # 헤더에서 위도/경도 컬럼 인덱스 찾기
                lat_idx = self._find_column_index(header, ['lat', 'latitude', '위도'])
                lng_idx = self._find_column_index(header, ['lng', 'lon', 'longitude', '경도'])
                
                if lat_idx is None or lng_idx is None:
                    # 헤더에서 찾지 못한 경우, 기본적으로 2, 3번째 컬럼 사용
                    lat_idx = 2
                    lng_idx = 3
                    # 첫 번째 줄을 다시 처리
                    csv_reader = csv.reader(io.StringIO(file_content))
            else:
                # 헤더가 없는 경우 기본 인덱스 사용
                lat_idx = 2
                lng_idx = 3
                csv_reader = csv.reader(io.StringIO(file_content))
            
            # 데이터 행 처리
            for row_idx, row in enumerate(csv_reader):
                try:
                    if len(row) > max(lat_idx, lng_idx):
                        lat = float(row[lat_idx])
                        lng = float(row[lng_idx])
                        
                        # 한국 좌표 범위 검증
                        if self._is_valid_korea_gps(lat, lng):
                            coordinates.append({'lat': lat, 'lng': lng})
                            
                except (ValueError, IndexError) as e:
                    # 잘못된 데이터 행은 건너뛰기
                    continue
                    
        except Exception as e:
            print(f"CSV 파싱 오류: {e}")
            # CSV 파싱 실패 시 기존 TXT 형식으로 시도
            return self._parse_txt_fallback(file_content)
        
        return coordinates
    
    def _find_column_index(self, header: List[str], possible_names: List[str]) -> Optional[int]:
        """헤더에서 특정 컬럼의 인덱스를 찾기"""
        for idx, col_name in enumerate(header):
            if col_name.lower().strip() in [name.lower() for name in possible_names]:
                return idx
        return None
    
    def _parse_txt_fallback(self, file_content: str) -> List[Dict[str, float]]:
        """
        기존 TXT 형식 파싱 (슬래시 구분자)
        CSV 파싱이 실패했을 때 사용하는 fallback 메서드
        """
        coordinates = []
        
        try:
            lines = file_content.strip().split('\n')
            
            for line in lines:
                parts = line.strip().split('/')
                
                if len(parts) >= 4:
                    try:
                        # 2번째, 3번째 값을 위도/경도로 시도
                        val2 = float(parts[2])
                        val3 = float(parts[3])
                        
                        # 한국 좌표 범위로 위도/경도 구분
                        if self._is_valid_korea_gps(val2, val3):
                            coordinates.append({'lat': val2, 'lng': val3})
                        elif self._is_valid_korea_gps(val3, val2):
                            coordinates.append({'lat': val3, 'lng': val2})
                            
                    except ValueError:
                        continue
                        
        except Exception as e:
            print(f"TXT 파싱 오류: {e}")
        
        return coordinates
    
    def _is_valid_korea_gps(self, lat: float, lng: float) -> bool:
        """한국 좌표 범위 검증"""
        return (33.0 <= lat <= 43.0) and (124.0 <= lng <= 132.0)
    
    def calculate_average_coordinates(self, coordinates: List[Dict[str, float]]) -> Optional[Dict[str, float]]:
        """GPS 좌표들의 평균 위치 계산"""
        if not coordinates:
            return None
        
        total_lat = sum(coord['lat'] for coord in coordinates)
        total_lng = sum(coord['lng'] for coord in coordinates)
        
        return {
            'lat': total_lat / len(coordinates),
            'lng': total_lng / len(coordinates)
        }
    
    def calculate_distance(self, coord1: Dict[str, float], coord2: Dict[str, float]) -> float:
        """
        두 GPS 좌표 간의 거리 계산 (하버사인 공식)
        
        Args:
            coord1: {'lat': float, 'lng': float}
            coord2: {'lat': float, 'lng': float}
            
        Returns:
            거리 (킬로미터)
        """
        lat1, lng1 = math.radians(coord1['lat']), math.radians(coord1['lng'])
        lat2, lng2 = math.radians(coord2['lat']), math.radians(coord2['lng'])
        
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # 지구 반지름 (킬로미터)
        earth_radius = 6371
        
        return earth_radius * c
    
    def find_nearest_ground(self, file_content: str) -> Optional[Dict]:
        """
        GPS 파일 내용을 분석하여 가장 가까운 경기장을 찾기
        
        Args:
            file_content: GPS 파일의 문자열 내용
            
        Returns:
            가장 가까운 경기장 정보 딕셔너리 또는 None
        """
        # GPS 좌표 추출
        coordinates = self.parse_csv_file(file_content)
        
        if not coordinates:
            print("유효한 GPS 좌표를 찾을 수 없습니다.")
            return None
        
        print(f"추출된 GPS 좌표 수: {len(coordinates)}")
        
        # 평균 좌표 계산
        avg_location = self.calculate_average_coordinates(coordinates)
        if not avg_location:
            print("평균 좌표 계산 실패")
            return None
        
        print(f"평균 GPS 좌표: {avg_location}")
        
        # 모든 경기장 조회
        try:
            grounds = GroundInfo.objects.filter(deleted_at__isnull=True)
            
            if not grounds.exists():
                print("등록된 경기장이 없습니다.")
                return None
            
            closest_ground = None
            min_distance = float('inf')
            
            for ground in grounds:
                try:
                    # 경기장 중심 좌표 추출
                    if ground.center and isinstance(ground.center, (list, dict)):
                        if isinstance(ground.center, list) and len(ground.center) >= 2:
                            ground_lat = float(ground.center[0])
                            ground_lng = float(ground.center[1])
                        elif isinstance(ground.center, dict):
                            ground_lat = float(ground.center.get('lat', 0))
                            ground_lng = float(ground.center.get('lng', 0))
                        else:
                            continue
                        
                        ground_coord = {'lat': ground_lat, 'lng': ground_lng}
                        
                        # 거리 계산
                        distance = self.calculate_distance(avg_location, ground_coord)
                        
                        print(f"경기장 {ground.name}: 거리 {distance:.3f}km")
                        
                        if distance < min_distance:
                            min_distance = distance
                            closest_ground = ground
                            
                except (ValueError, TypeError, KeyError) as e:
                    print(f"경기장 {ground.ground_code} 좌표 처리 오류: {e}")
                    continue
            
            if closest_ground and min_distance <= self.distance_threshold * 100:  # 100km 이내
                print(f"가장 가까운 경기장: {closest_ground.name} (거리: {min_distance:.3f}km)")
                
                return {
                    'ground_code': closest_ground.ground_code,
                    'name': closest_ground.name,
                    'address': closest_ground.address,
                    'center': closest_ground.center,
                    'corner_gps': closest_ground.corner_gps,
                    'rotate_deg': closest_ground.rotate_deg,
                    'north_side_utm': closest_ground.north_side_utm,
                    'south_side_utm': closest_ground.south_side_utm,
                    'east_side_utm': closest_ground.east_side_utm,
                    'west_side_utm': closest_ground.west_side_utm,
                    'distance_km': round(min_distance, 3),
                    'avg_gps_location': avg_location
                }
            else:
                print(f"임계값 내 경기장 없음. 최단거리: {min_distance:.3f}km")
                return None
                
        except Exception as e:
            print(f"경기장 검색 중 오류: {e}")
            return None


# ===============================================
# API View 클래스
# ===============================================

class Get_GroundSearch(APIView):
    """
    경기장 정보 조회 API
    경기장 코드로 경기장의 상세 정보를 조회합니다.
    """
    
    @swagger_auto_schema(
        operation_description="경기장 코드로 경기장 정보를 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'ground_code',
                openapi.IN_QUERY,
                description="경기장 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="경기장을 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """경기장 정보 조회"""
        ground_code = request.query_params.get('ground_code')
        
        if not ground_code:
            return Response(
                {"error": "ground_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            ground = get_object_or_404(GroundInfo, ground_code=ground_code, deleted_at__isnull=True)
            
            return Response({
                "ground_code": ground.ground_code,
                "name": ground.name,
                "address": ground.address,
                "who_make": ground.who_make,
                "long_side_length": ground.long_side_length,
                "short_side_length": ground.short_side_length,
                "rotate_deg": ground.rotate_deg,
                "center": ground.center,
                "corner_gps": ground.corner_gps,
                "north_side_utm": ground.north_side_utm,
                "south_side_utm": ground.south_side_utm,
                "east_side_utm": ground.east_side_utm,
                "west_side_utm": ground.west_side_utm,
                "created_at": ground.created_at.isoformat() if ground.created_at else None,
                "updated_at": ground.updated_at.isoformat() if ground.updated_at else None
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class Get_GroundList(APIView):
    """
    경기장 목록 조회 API
    경기장 목록을 조회하며 검색 및 페이지네이션을 지원합니다.
    """
    
    @swagger_auto_schema(
        operation_description="경기장 목록을 조회합니다.",
        manual_parameters=[
            openapi.Parameter(
                'search', 
                openapi.IN_QUERY,
                description="검색어 (경기장 이름 또는 주소로 검색)",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'page',
                openapi.IN_QUERY,
                description="페이지 번호 (기본값: 1)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'page_size',
                openapi.IN_QUERY,
                description="페이지당 항목 수 (기본값: 20)",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ],
        responses={
            200: openapi.Response(description="조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """경기장 목록 조회"""
        try:
            # 쿼리 파라미터 가져오기
            search_term = request.query_params.get('search', '').strip()
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            
            # 기본 쿼리셋 (soft delete 제외)
            queryset = GroundInfo.objects.filter(deleted_at__isnull=True)
            
            # 검색 기능
            if search_term:
                queryset = queryset.filter(
                    Q(name__icontains=search_term) | 
                    Q(address__icontains=search_term)
                )
            
            # 생성일 기준 내림차순 정렬
            queryset = queryset.order_by('-created_at')
            
            # 페이지네이션
            total_count = queryset.count()
            start_index = (page - 1) * page_size
            end_index = start_index + page_size
            grounds = queryset[start_index:end_index]
            
            # 응답 데이터 구성
            ground_list = []
            for ground in grounds:
                ground_list.append({
                    "ground_code": ground.ground_code,
                    "name": ground.name,
                    "address": ground.address,
                    "who_make": ground.who_make,
                    "center": ground.center,
                    "corner_gps": ground.corner_gps,
                    "rotate_deg": ground.rotate_deg,
                    "north_side_utm": ground.north_side_utm,
                    "south_side_utm": ground.south_side_utm,
                    "east_side_utm": ground.east_side_utm,
                    "west_side_utm": ground.west_side_utm,
                    "created_at": ground.created_at.isoformat() if ground.created_at else None
                })
            
            return Response({
                "success": True,
                "data": {
                    "grounds": ground_list,
                    "pagination": {
                        "total_count": total_count,
                        "page": page,
                        "page_size": page_size,
                        "total_pages": (total_count + page_size - 1) // page_size,
                        "has_next": end_index < total_count,
                        "has_previous": page > 1
                    }
                }
            }, status=status.HTTP_200_OK)
            
        except ValueError:
            return Response(
                {"error": "페이지 번호나 페이지 크기는 숫자여야 합니다."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"경기장 목록 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetUserAnalysisGrounds(APIView):
    """
    사용자 분석 경기장 목록 조회 API
    사용자가 분석을 진행한 경기장 목록을 반환합니다.
    """
    
    @swagger_auto_schema(
        operation_description="사용자가 분석을 진행한 경기장 목록을 가져옵니다.",
        manual_parameters=[
            openapi.Parameter(
                'user_code', 
                openapi.IN_QUERY,
                description="사용자 코드",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'limit', 
                openapi.IN_QUERY,
                description="가져올 경기장 수 (기본값: 10)",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ],
        responses={
            200: openapi.Response(description="사용자 분석 경기장 조회 성공"),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        try:
            user_code = request.query_params.get('user_code')
            if not user_code:
                return Response(
                    {"error": "user_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            limit = int(request.query_params.get('limit', 10))
            
            # 사용자가 참여한 경기들의 경기장 코드를 가져옵니다
            from DB.models import PlayerMatch, PlayerMatchCross
            
            # 사용자가 참여한 경기 코드들 조회
            match_codes = PlayerMatchCross.objects.filter(
                user_code=user_code,
                deleted_at__isnull=True
            ).values_list('match_code', flat=True)
            
            # 해당 경기들의 경기장 정보 조회
            grounds = GroundInfo.objects.filter(
                ground_code__in=PlayerMatch.objects.filter(
                    match_code__in=match_codes,
                    deleted_at__isnull=True
                ).values_list('ground_code', flat=True),
                deleted_at__isnull=True
            ).order_by('-updated_at')[:limit]
            
            ground_list = []
            for ground in grounds:
                # 해당 경기장에서의 마지막 분석 시간 조회
                last_match = PlayerMatch.objects.filter(
                    ground_code=ground.ground_code,
                    match_code__in=match_codes,
                    deleted_at__isnull=True
                ).order_by('-start_time').first()
                
                ground_list.append({
                    "ground_code": ground.ground_code,
                    "name": ground.name,
                    "address": ground.address,
                    "who_make": ground.who_make,
                    "center": ground.center,
                    "corner_gps": ground.corner_gps,
                    "rotate_deg": ground.rotate_deg,
                    "north_side_utm": ground.north_side_utm,
                    "south_side_utm": ground.south_side_utm,
                    "east_side_utm": ground.east_side_utm,
                    "west_side_utm": ground.west_side_utm,
                    "created_at": ground.created_at.isoformat() if ground.created_at else None,
                    "last_analyzed": last_match.start_time.isoformat() if last_match and last_match.start_time else None
                })
            
            return Response({
                "success": True,
                "data": {
                    "grounds": ground_list,
                    "count": len(ground_list)
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"사용자 분석 경기장 목록 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetKakaoMapKey(APIView):
    """
    카카오맵 API 키 조회 API
    카카오맵 사용을 위한 API 키를 반환합니다.
    """
    
    @swagger_auto_schema(
        operation_description="카카오맵 API 키를 조회합니다.",
        responses={
            200: openapi.Response(description="조회 성공"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """카카오맵 API 키 조회"""
        try:
            return Response({
                "success": True,
                "kakao_map_key": getattr(settings, 'KAKAO_MAP_KEY', None)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"카카오맵 API 키 조회 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FindGroundFromGPSFile(APIView):
    """
    GPS 파일 기반 경기장 찾기 API
    업로드된 GPS 파일을 분석하여 가장 가까운 경기장을 찾습니다.
    """
    
    @swagger_auto_schema(
        operation_description="업로드된 GPS 파일을 분석하여 가장 가까운 경기장을 찾습니다.",
        manual_parameters=[
            openapi.Parameter(
                'upload_code', 
                openapi.IN_QUERY,
                description="업로드 파일 코드",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(description="경기장 찾기 성공"),
            400: openapi.Response(description="잘못된 요청"),
            404: openapi.Response(description="파일을 찾을 수 없음"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def get(self, request):
        """GPS 파일에서 경기장 찾기"""
        upload_code = request.query_params.get('upload_code')
        
        if not upload_code:
            return Response(
                {"error": "upload_code parameter is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 업로드 파일 정보 조회
            upload_file = get_object_or_404(Upload, upload_code=upload_code, deleted_at__isnull=True)
            
            if not upload_file.file_path:
                return Response(
                    {"error": "파일 경로가 없습니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # S3에서 파일 내용 가져오기
            file_content = self._get_s3_file_content(upload_file.file_path)
            
            if not file_content:
                return Response(
                    {"error": "파일 내용을 가져올 수 없습니다."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # 경기장 찾기
            ground_finder = GroundFinder()
            nearest_ground = ground_finder.find_nearest_ground(file_content)
            
            if nearest_ground:
                return Response({
                    "success": True,
                    "ground": nearest_ground
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "success": False,
                    "message": "근처에 경기장을 찾을 수 없습니다."
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response(
                {"error": f"GPS 파일에서 경기장 찾기 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_s3_file_content(self, file_path: str) -> str:
        """S3에서 파일 내용을 가져오는 헬퍼 메서드"""
        try:
            # S3 클라이언트 생성
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )
            
            # URL에서 버킷과 키 추출
            parsed_url = urllib.parse.urlparse(file_path)
            bucket_name = parsed_url.netloc.split('.')[0]
            key = parsed_url.path.lstrip('/')
            
            # 경로 정규화
            if '/edit/' in key and '/player/edit/' not in key:
                key = key.replace('/edit/', '/player/edit/')
            elif '/raw/' in key:
                key = key.replace('/raw/', '/player/edit/')
            elif not '/player/edit/' in key:
                key_parts = key.split('/')
                if len(key_parts) >= 2:
                    key_parts.insert(-1, 'player')
                    key_parts.insert(-1, 'edit')
                    key = '/'.join(key_parts)
            
            print(f"Ground Finder API - 파일 경로: {key}")
            
            # S3에서 파일 내용 가져오기
            response = s3_client.get_object(Bucket=bucket_name, Key=key)
            file_content = response['Body'].read().decode('utf-8')
            
            return file_content
            
        except ClientError as e:
            print(f"S3 파일 가져오기 실패: {e}")
            return None
        except Exception as e:
            print(f"파일 내용 가져오기 오류: {e}")
            return None


class CreateGround(APIView):
    """
    경기장 생성 API
    4개의 모서리 GPS 좌표를 받아 경기장 정보를 계산하고 저장합니다.
    """
    
    @swagger_auto_schema(
        operation_description="4개의 모서리 GPS 좌표로 새로운 경기장을 생성합니다.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['corner_gps', 'name', 'user_code'],
            properties={
                'corner_gps': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    description='4개의 모서리 GPS 좌표 [[위도, 경도], ...]',
                    items=openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(type=openapi.TYPE_NUMBER)
                    ),
                    example=[
                        [37.543697, 126.960590],
                        [37.544058, 126.961212],
                        [37.543774, 126.961478],
                        [37.543411, 126.960865]
                    ]
                ),
                'name': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='경기장 이름',
                    example='효창운동장 유소년 B구장'
                ),
                'address': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='경기장 주소',
                    example='서울시 용산구 효창동'
                ),
                'user_code': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='생성자 사용자 코드',
                    example='USER_001'
                )
            }
        ),
        responses={
            201: openapi.Response(
                description="경기장 생성 성공",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'ground': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'ground_code': openapi.Schema(type=openapi.TYPE_STRING),
                                'name': openapi.Schema(type=openapi.TYPE_STRING),
                                'address': openapi.Schema(type=openapi.TYPE_STRING),
                                'center': openapi.Schema(
                                    type=openapi.TYPE_ARRAY, 
                                    items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                ),
                                'corner_gps': openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                    )
                                ),
                                'corner_utm': openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                    )
                                ),
                                'north_side_utm': openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                    )
                                ),
                                'south_side_utm': openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                    )
                                ),
                                'east_side_utm': openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                    )
                                ),
                                'west_side_utm': openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(type=openapi.TYPE_NUMBER)
                                    )
                                ),
                                'long_side_length': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'short_side_length': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'rotate_deg': openapi.Schema(type=openapi.TYPE_NUMBER)
                            }
                        )
                    }
                )
            ),
            400: openapi.Response(description="잘못된 요청"),
            500: openapi.Response(description="서버 오류")
        }
    )
    def post(self, request):
        """경기장 생성"""
        try:
            # 필수 파라미터 검증
            corner_gps = request.data.get('corner_gps')
            name = request.data.get('name')
            user_code = request.data.get('user_code')
            address = request.data.get('address', '')
            
            if not corner_gps:
                return Response(
                    {"error": "corner_gps parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not name:
                return Response(
                    {"error": "name parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not user_code:
                return Response(
                    {"error": "user_code parameter is required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # corner_gps 형식 검증
            if not isinstance(corner_gps, list) or len(corner_gps) != 4:
                return Response(
                    {"error": "corner_gps must be an array of 4 GPS coordinates."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            for i, coord in enumerate(corner_gps):
                if not isinstance(coord, list) or len(coord) != 2:
                    return Response(
                        {"error": f"corner_gps[{i}] must be [latitude, longitude] format."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                try:
                    float(coord[0])
                    float(coord[1])
                except (ValueError, TypeError):
                    return Response(
                        {"error": f"corner_gps[{i}] coordinates must be numbers."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # 경기장 정보 계산
            try:
                ground_data = calculate_ground_info(corner_gps, name)
            except ValueError as e:
                return Response(
                    {"error": str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 경기장 코드 생성 (g_ + 숫자+영어 10자리)
            # 중복 방지를 위해 최대 10회 재시도
            ground_code = None
            for _ in range(10):
                temp_code = generate_ground_code()
                if not GroundInfo.objects.filter(ground_code=temp_code).exists():
                    ground_code = temp_code
                    break
            
            if not ground_code:
                return Response(
                    {"error": "경기장 코드 생성에 실패했습니다. 다시 시도해주세요."}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # 중복 경기장 확인 (같은 이름)
            existing_grounds = GroundInfo.objects.filter(
                name=name,
                deleted_at__isnull=True
            )
            
            if existing_grounds.exists():
                return Response(
                    {"error": f"'{name}' 경기장이 이미 존재합니다."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # DB에 저장
            ground = GroundInfo.objects.create(
                ground_code=ground_code,
                who_make=user_code,
                name=name,
                address=address,
                corner_gps=ground_data['corner_gps'],
                corner_utm=ground_data['corner_utm'],
                center=ground_data['center'],
                long_side_length=ground_data['long_side_length'],
                short_side_length=ground_data['short_side_length'],
                rotate_deg=ground_data['rotate_deg'],
                rotated_corners=ground_data['rotated_corners'],
                new_long=ground_data['new_long'],
                new_short=ground_data['new_short'],
                north_side_utm=ground_data['north_side_utm'],
                south_side_utm=ground_data['south_side_utm'],
                east_side_utm=ground_data['east_side_utm'],
                west_side_utm=ground_data['west_side_utm']
            )
            
            return Response({
                "success": True,
                "message": "경기장이 성공적으로 생성되었습니다.",
                "ground": {
                    "ground_code": ground.ground_code,
                    "name": ground.name,
                    "address": ground.address,
                    "who_make": ground.who_make,
                    "center": ground.center,
                    "corner_gps": ground.corner_gps,
                    "corner_utm": ground.corner_utm,
                    "long_side_length": ground.long_side_length,
                    "short_side_length": ground.short_side_length,
                    "rotate_deg": ground.rotate_deg,
                    "north_side_utm": ground.north_side_utm,
                    "south_side_utm": ground.south_side_utm,
                    "east_side_utm": ground.east_side_utm,
                    "west_side_utm": ground.west_side_utm,
                    "created_at": ground.created_at.isoformat() if ground.created_at else None
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"경기장 생성 오류: {e}")
            return Response(
                {"error": f"경기장 생성 중 오류가 발생했습니다: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

