import pandas as pd
import numpy as np
import json
import time
from io import StringIO
import base64
import os
import re
from datetime import datetime, timedelta
from typing import Union

try:
    import utm
except Exception:
    utm = None
try:
    import matplotlib.pyplot as plt
    HAS_MATPLOTLIB = True
except ImportError:
    HAS_MATPLOTLIB = False
    plt = None

def gaussian_filter(input_array, sigma=1):
    kernel_size = int(2 * np.ceil(3 * sigma) + 1)
    
    x = np.arange(kernel_size) - (kernel_size - 1) / 2
    kernel_1d = np.exp(-x**2 / (2 * sigma**2))
    kernel_1d = kernel_1d / kernel_1d.sum()
    kernel_2d = np.outer(kernel_1d, kernel_1d)
    pad_width = kernel_size // 2
    padded = np.pad(input_array, pad_width, mode='reflect')
    
    output = np.zeros_like(input_array)
    for i in range(input_array.shape[0]):
        for j in range(input_array.shape[1]):
            output[i, j] = np.sum(padded[i:i+kernel_size, j:j+kernel_size] * kernel_2d)
    
    return output

def binary_dilation(input_array, structure=None):
    if structure is None:
        structure = np.ones((3, 3), dtype=bool)
    
    pad_h = structure.shape[0] // 2
    pad_w = structure.shape[1] // 2
    padded = np.pad(input_array, ((pad_h, pad_h), (pad_w, pad_w)), mode='constant', constant_values=False)
    
    output = np.zeros_like(input_array, dtype=bool)
    for i in range(input_array.shape[0]):
        for j in range(input_array.shape[1]):
            window = padded[i:i+structure.shape[0], j:j+structure.shape[1]]
            output[i, j] = np.any(window & structure)
    
    return output

def load_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def rotate(data, where=None, ground_json='ground_data.json', ground_dict=None):
    if ground_dict is not None:
        ground_data = ground_dict
    else:
        ground_info = load_json_file(ground_json)
        found = False
        ground_data = None
        for item in ground_info:
            if item["ground_name"] == where:
                found = True
                ground_data = item
                break
        
        if not found:
            print(f"'{where}' 키를 찾을 수 없습니다. ground_data.json 확인 필요.")
            return None
    
    lat_center = ground_data["center"][0]
    lon_center = ground_data["center"][1]
    angle_deg  = ground_data["rotate_deg"]
    original_ids = []
    x_orig = []
    y_orig = []
    
    for entry in data:
        parts = entry.split('/')
        id_  = parts[0]
        lat  = float(parts[2])
        lon  = float(parts[3])
        
        original_ids.append(id_)
        x_orig.append(lat)
        y_orig.append(lon)
    
    theta = np.radians(angle_deg)
    cos_t, sin_t = np.cos(theta), np.sin(theta)

    x_rot = []
    y_rot = []
    
    for x, y in zip(x_orig, y_orig):
        dx = x - lat_center
        dy = y - lon_center
        rx = dx * cos_t - dy * sin_t
        ry = dx * sin_t + dy * cos_t
        rx += lat_center
        ry += lon_center
        x_rot.append(rx)
        y_rot.append(ry)
    
    rotated_data = []
    for i, entry in enumerate(data):
        parts = entry.split('/')
        id_  = parts[0]
        time = parts[1]
        new_entry = f"{id_}/{time}/{x_rot[i]}/{y_rot[i]}"
        rotated_data.append(new_entry)
    
    return rotated_data

def calculate_direction(x_diff, y_diff):
    return np.degrees(np.arctan2(y_diff, x_diff))

def calculate_angle_change(angle_diff):
    return (angle_diff + 180) % 360 - 180

def point_to_block(point, new_short, new_long):
    block_avg_x = int((90*(point[0]-new_long[0]))/(new_long[1] - new_long[0]))
    block_avg_y = int((60*(point[1]-new_short[0]))/(new_short[1] - new_short[0]))
    return block_avg_x, block_avg_y

def calculate_activity_area(df, new_short, new_long, type, grid_size=(90, 60), dilate=4):
        
    x_min, x_max = new_long
    y_min, y_max = new_short
    x_bins = np.linspace(x_min, x_max, grid_size[0] + 1)
    y_bins = np.linspace(y_min, y_max, grid_size[1] + 1)
    
    heatmap, _, _ = np.histogram2d(df['X'], df['Y'], bins=[x_bins, y_bins])
    occupied = heatmap > 0

    if dilate > 0:
        structure = np.ones((2 * dilate + 1, 2 * dilate + 1), dtype=bool)
        occupied = binary_dilation(occupied, structure=structure)

    activity_percentage = occupied.sum() / occupied.size * 100
    return activity_percentage

def create_heatmap(speed, quarter_data, new_short, new_long, short_div=60, long_div=90, sigma=3, sample_fraction=0.1):
    high_speed_data = quarter_data[quarter_data['Speed'] >= speed]
    x_coords = high_speed_data['X'].values
    y_coords = high_speed_data['Y'].values

    sample_size = int(len(x_coords) * sample_fraction)
    sampled_indices = np.random.choice(len(x_coords), sample_size, replace=False)
    x_coords_sampled = x_coords[sampled_indices]
    y_coords_sampled = y_coords[sampled_indices]
    
    heatmap, xedges, yedges = np.histogram2d(
        y_coords_sampled, x_coords_sampled,
        bins=[short_div, long_div],
        range=[[new_short[0] - 5, new_short[1] + 5], [new_long[0] - 5, new_long[1] + 5]]
    )

    heatmap_smooth = gaussian_filter(heatmap, sigma=sigma)

    max_value = heatmap_smooth.max()
    if max_value > 0:
        heatmap_percentage = (heatmap_smooth / max_value) * 100
    else:
        heatmap_percentage = heatmap_smooth

    heatmap_list = [[round(value, 2) for value in row] for row in heatmap_percentage]
    
    return heatmap_list

def _encode_array_b64(arr: np.ndarray) -> str:
    return base64.b64encode(arr.tobytes()).decode('ascii')

def build_grid_layers(df: pd.DataFrame, new_short, new_long, phase: str, quarter_name: str,
                      resolution_m: float = 1.0, layer_names=("dwell_seconds",),
                      dtype: str = "uint16", force_shape=(60, 90)):
    if force_shape:
        height_m = int(force_shape[0])
        width_m = int(force_shape[1])
    else:
        width_m = int(round((new_long[1] - new_long[0]) / resolution_m))
        height_m = int(round((new_short[1] - new_short[0]) / resolution_m))
    if len(df.index) >= 2:
        sample_interval = float(np.nanmedian(np.diff(df.index.view('i8'))) / 1e9)
        if not np.isfinite(sample_interval) or sample_interval <= 0:
            sample_interval = 0.2
    else:
        sample_interval = 0.2
    if not df.empty:
        x_span = (new_long[1] - new_long[0]) if (new_long[1] - new_long[0]) != 0 else 1.0
        y_span = (new_short[1] - new_short[0]) if (new_short[1] - new_short[0]) != 0 else 1.0
        x_idx = ((df['X'].values - new_long[0]) / x_span * width_m).astype(int)
        y_idx = ((df['Y'].values - new_short[0]) / y_span * height_m).astype(int)
        x_idx = np.clip(x_idx, 0, width_m - 1)
        y_idx = np.clip(y_idx, 0, height_m - 1)
    else:
        x_idx = np.array([], dtype=int)
        y_idx = np.array([], dtype=int)

    dwell = np.zeros((height_m, width_m), dtype=np.float32)
    if x_idx.size > 0:
        for xi, yi in zip(x_idx, y_idx):
            dwell[yi, xi] += sample_interval

    if dtype == "uint16":
        scaled = np.clip(np.round(dwell * 10.0), 0, 65535).astype(np.uint16)
        payload_arr = scaled
    else:
        payload_arr = dwell.astype(np.float32)
    flat = dwell.flatten()
    stats = {
        "min": float(np.min(flat)) if flat.size else 0.0,
        "p50": float(np.percentile(flat, 50)) if flat.size else 0.0,
        "p90": float(np.percentile(flat, 90)) if flat.size else 0.0,
        "max": float(np.max(flat)) if flat.size else 0.0,
    }

    layer_obj = {
        "name": "dwell_seconds",
        "unit": "sec",
        "agg": "sum",
        "phase": phase,
        "dtype": dtype,
        "shape": [int(height_m), int(width_m)],
        "b64": _encode_array_b64(payload_arr),
        "stats": stats,
    }

    grid_obj = {
        "resolution_m": 1.0 if force_shape else resolution_m,
        "height": int(height_m),
        "width": int(width_m)
    }

    return {
        "grid": grid_obj,
        "layers": [layer_obj],
        "masks": {}
    }

def _build_direction_map(ldt_coords, hdt_coords, quarter_name: str, phase: str,
                         height: int = 60, width: int = 90, dtype: str = "uint16"):
    def count_grid(coords):
        grid = np.zeros((height, width), dtype=np.float32)
        for xy in coords:
            if not xy or len(xy) < 2:
                continue
            x, y = int(xy[0]), int(xy[1])
            if 0 <= x < width and 0 <= y < height:
                grid[y, x] += 1.0
        return grid

    def extract_xy_list(raw_list):
        out = []
        for item in raw_list or []:
            if isinstance(item, (list, tuple)):
                if len(item) >= 2 and isinstance(item[1], (list, tuple)) and len(item[1]) >= 2:
                    out.append([int(item[1][0]), int(item[1][1])])
                elif len(item) >= 2 and isinstance(item[0], (int, float)) and isinstance(item[1], (int, float)):
                    out.append([int(item[0]), int(item[1])])
        return out

    ldt_xy = extract_xy_list(ldt_coords)
    hdt_xy = extract_xy_list(hdt_coords)

    ldt_grid = count_grid(ldt_xy)
    hdt_grid = count_grid(hdt_xy)

    def to_layer(grid, name):
        if dtype == "uint16":
            payload = np.clip(grid, 0, 65535).astype(np.uint16)
        else:
            payload = grid.astype(np.float32)
        flat = grid.flatten()
        stats = {
            "min": float(np.min(flat)) if flat.size else 0.0,
            "p50": float(np.percentile(flat, 50)) if flat.size else 0.0,
            "p90": float(np.percentile(flat, 90)) if flat.size else 0.0,
            "max": float(np.max(flat)) if flat.size else 0.0,
        }
        return {
            "name": name,
            "unit": "count",
            "agg": "sum",
            "phase": phase,
            "dtype": dtype,
            "shape": [int(height), int(width)],
            "b64": _encode_array_b64(payload),
            "stats": stats,
        }

    grid_obj = {
        "resolution_m": 1.0,
        "height": int(height),
        "width": int(width)
    }

    return {
        "grid": grid_obj,
        "layers": [
            to_layer(ldt_grid, "LDT_count"),
            to_layer(hdt_grid, "HDT_count"),
        ],
        "masks": {}
    }

def _build_sprint_map(sprint_events, quarter_name: str, phase: str,
                      height: int = 60, width: int = 90):
    count = np.zeros((height, width), dtype=np.float32)
    sum_cos = np.zeros((height, width), dtype=np.float32)
    sum_sin = np.zeros((height, width), dtype=np.float32)
    vmax_sum = np.zeros((height, width), dtype=np.float32)

    total_sprint_count = len(sprint_events) if sprint_events else 0
    processed_count = 0
    
    for ev in sprint_events or []:
        if not ev or len(ev) < 6:
            continue
        xy = ev[2] if len(ev) > 2 else None
        if not xy or len(xy) < 2:
            continue
        
        x, y = int(xy[0]), int(xy[1])
        x = max(0, min(x, width - 1))
        y = max(0, min(y, height - 1))
        
        angle = float(ev[3])
        vmax = float(ev[5])
        rad = np.radians(angle)
        count[y, x] += 1.0
        sum_cos[y, x] += np.cos(rad)
        sum_sin[y, x] += np.sin(rad)
        vmax_sum[y, x] += vmax
        processed_count += 1
    angle_mean = np.degrees(np.arctan2(sum_sin, sum_cos)).astype(np.float32)
    with np.errstate(invalid='ignore'):
        vmax_mean = (vmax_sum / np.maximum(count, 1.0)).astype(np.float32)
    angle_mean = np.where(count > 0, angle_mean, 0.0).astype(np.float32)
    vmax_mean = np.where(count > 0, vmax_mean, 0.0).astype(np.float32)

    def mk_layer(grid: np.ndarray, name: str, dtype: str):
        if dtype == "uint16":
            payload = np.clip(grid, 0, 65535).astype(np.uint16)
        else:
            payload = grid.astype(np.float32)
        flat = grid.flatten()
        stats = {
            "min": float(np.min(flat)) if flat.size else 0.0,
            "p50": float(np.percentile(flat, 50)) if flat.size else 0.0,
            "p90": float(np.percentile(flat, 90)) if flat.size else 0.0,
            "max": float(np.max(flat)) if flat.size else 0.0,
        }
        return {
            "name": name,
            "unit": "count" if name == "S_count" else ("deg" if name == "S_angle_deg" else "km/h"),
            "agg": "mean" if name != "S_count" else "sum",
            "phase": phase,
            "dtype": dtype,
            "shape": [int(height), int(width)],
            "b64": _encode_array_b64(payload),
            "stats": stats,
        }

    grid_obj = {"resolution_m": 1.0, "height": int(height), "width": int(width)}
    layers = [
        mk_layer(count, "S_count", "uint16"),
        mk_layer(angle_mean, "S_angle_deg", "float32"),
        mk_layer(vmax_mean, "S_vmax_mean", "float32"),
    ]

    total_grid_count = int(count.sum())
    if total_grid_count != total_sprint_count:
        print(f"경고: T_SMAP - 전체 스프린트({total_sprint_count}), 처리된 스프린트({processed_count}), 그리드 총합({total_grid_count}) - 개수가 일치하지 않음!")

    return {"grid": grid_obj, "layers": layers, "masks": {}}

def show_heatmap(heatmap_list, new_short, new_long, cmap="hot"):
    arr = np.array(heatmap_list)

    plt.figure(figsize=(9, 6))
    # origin="lower"  → 행렬의 (0,0)을 왼쪽 아래로
    # extent          → 축 눈금이 실제 경기장 좌표와 일치하도록
    plt.imshow(
        arr,
        origin="lower",
        extent=[new_long[0], new_long[1], new_short[0], new_short[1]],
        cmap=cmap,
        aspect="auto",
        vmin=0,
        vmax=100         # 0 ~ 100 % 스케일
    )
    plt.colorbar(label="% of max density")
    plt.xlabel("Y  (meters)")
    plt.ylabel("X  (meters)")
    plt.title("Movement Heatmap")
    plt.grid(False)
    plt.show()
    
# ===============================================
# 첫번째 계산
# ===============================================
def first_cal(data):
    """
    1차 기본 데이터 계산 (이동거리, 시간, 속도, 가속도 등)
    
    Args:
        data (pd.DataFrame): GPS 데이터프레임
    
    Returns:
        tuple: (T_D, T_T, T_AS, T_HS, T_HS_T, T_AA, T_HA, T_HA_T, T_HTS, T_LTS, T_GS, T_DPM)
            - T_D: 총 이동거리 (km)
            - T_T: 총 이동시간 (분)
            - T_AS: 평균 속력 (km/h)
            - T_HS: 최고 속력 (km/h)
            - T_HS_T: 최고 속력 발생 시각
            - T_AA: 평균 가속도 (m/s²)
            - T_HA: 최고 가속도 (m/s²)
            - T_HA_T: 최고 가속도 발생 시각
            - T_HTS: 상위 10% 속력 (km/h)
            - T_LTS: 하위 10% 속력 (km/h)
            - T_GS: 상위-하위 속력 차이 (km/h)
            - T_DPM: 분당 이동거리 (m/min)
    """
    if data.empty or len(data) < 2:
        return 0.0, 0.0, 0.0, 0.0, None, 0.0, 0.0, None, 0.0, 0.0, 0.0, 0.0
    
    D = 0.0
    if len(data) >= 2:
        x_coords = data['X'].values
        y_coords = data['Y'].values
        
        for i in range(1, len(data)):
            x1, y1 = x_coords[i-1], y_coords[i-1]
            x2, y2 = x_coords[i], y_coords[i]
            distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
            D += distance
    
    if len(data) >= 2:
        T = max(0.0, (data.index[-1] - data.index[0]).total_seconds() / 60.0)
    else:
        T = 0.0
    
    AS = float(data['Speed'].mean()) if not data['Speed'].empty else 0.0
    D = D / 1000.0
    DPM = ((D * 1000.0) / T) if T > 0 else 0.0
    
    HS = data['Speed'].max() if not data['Speed'].empty else 0
    HS_T = data['Speed'].idxmax() if not data['Speed'].empty and data['Speed'].max() > 0 and len(data) > 1 else None
    AA = float(data['Acceleration'].mean()) if not data['Acceleration'].empty else 0.0
    HA = float(data['Acceleration'].max()) if not data['Acceleration'].empty else 0.0
    HA_T = data['Acceleration'].idxmax() if not data['Acceleration'].empty and data['Acceleration'].max() > 0 and len(data) > 1 else None
    LTS = float(np.percentile(data['Speed'].dropna(), 30)) if not data['Speed'].dropna().empty else 0.0
    HTS = float(np.percentile(data['Speed'].dropna(), 70)) if not data['Speed'].dropna().empty else 0.0
    GS = HTS - LTS
    return D, T, AS, HS, HS_T, AA, HA, HA_T, HTS, LTS, GS, DPM

def calculate_region_distance(total_data, attack_data, defense_data, mid_long, home_side):
    attack_distance = 0.0
    defense_distance = 0.0
    
    if len(total_data) < 2:
        return attack_distance, defense_distance
    
    attack_on_right = home_side != "east"
    
    # 벡터화된 계산을 위해 numpy 배열로 변환
    x_coords = total_data['X'].values
    y_coords = total_data['Y'].values
    
    for i in range(1, len(total_data)):
        # 두 UTM 포인트 간의 거리 계산 (유클리드 거리)
        x1, y1 = x_coords[i-1], y_coords[i-1]
        x2, y2 = x_coords[i], y_coords[i]
        
        # 유클리드 거리 공식 (미터 단위)
        distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        
        # 이전 포인트와 현재 포인트의 지역 판단
        prev_is_attack = _is_attack_side(x1, mid_long, attack_on_right)
        curr_is_attack = _is_attack_side(x2, mid_long, attack_on_right)
        
        if prev_is_attack and curr_is_attack:
            # 공격→공격: 전체 거리를 공격에 할당
            attack_distance += distance
        elif not prev_is_attack and not curr_is_attack:
            # 수비→수비: 전체 거리를 수비에 할당
            defense_distance += distance
        else:
            # 지역 변경: 거리를 반반씩 분배
            half_distance = distance / 2.0
            attack_distance += half_distance
            defense_distance += half_distance
    
    # 미터를 km로 변환
    attack_distance = attack_distance / 1000.0
    defense_distance = defense_distance / 1000.0
    
    return attack_distance, defense_distance

def calculate_region_time(total_data, mid_long, home_side):
    """
    전체 데이터에서 공격/수비 지역별 시간을 정확히 계산
    
    Args:
        total_data: 전체 데이터
        mid_long: 경계선 X 좌표
        home_side: 쿼터 홈 방향 (east/west)
    
    Returns:
        tuple: (attack_time, defense_time)
    """
    attack_time = 0.0
    defense_time = 0.0
    
    if len(total_data) < 2:
        return attack_time, defense_time
    
    attack_on_right = home_side != "east"
    
    # 벡터화된 계산을 위해 numpy 배열로 변환
    x_coords = total_data['X'].values
    time_index = total_data.index
    
    for i in range(1, len(total_data)):
        # 두 포인트 간의 시간 차이 (분)
        time_diff = (time_index[i] - time_index[i-1]).total_seconds() / 60.0
        
        # 이전 포인트와 현재 포인트의 지역 판단
        prev_is_attack = _is_attack_side(x_coords[i-1], mid_long, attack_on_right)
        curr_is_attack = _is_attack_side(x_coords[i], mid_long, attack_on_right)
        
        if prev_is_attack and curr_is_attack:
            # 공격→공격: 전체 시간을 공격에 할당
            attack_time += time_diff
        elif not prev_is_attack and not curr_is_attack:
            # 수비→수비: 전체 시간을 수비에 할당
            defense_time += time_diff
        else:
            # 지역 변경: 시간을 반반씩 분배
            half_time = time_diff / 2.0
            attack_time += half_time
            defense_time += half_time
    
    return attack_time, defense_time

def calculate_region_direction_changes(total_data, mid_long, new_short, new_long, type, home_side, gap_sec=5):
    """
    전체 데이터에서 공격/수비 지역별 방향전환을 정확히 계산
    
    Args:
        total_data: 전체 데이터
        mid_long: 경계선 X 좌표
        new_short: 운동장 짧은 변 좌표
        new_long: 운동장 긴 변 좌표
        type: 선수 타입
        home_side: 쿼터 홈 방향 (east/west)
        gap_sec: 방향 전환 간 최소 시간 간격 (초)
    
    Returns:
        tuple: (attack_ldt, attack_hdt, attack_ldt_l, attack_hdt_l, 
                defense_ldt, defense_hdt, defense_ldt_l, defense_hdt_l)
    """
    if type == "pro":
        min_speed = 8
    elif type == "amateur":
        min_speed = 6
    elif type == "youth":
        min_speed = 4
    else:
        min_speed = 6
    
    attack_ldt = 0
    attack_hdt = 0
    attack_ldt_l = []
    attack_hdt_l = []
    
    defense_ldt = 0
    defense_hdt = 0
    defense_ldt_l = []
    defense_hdt_l = []
    
    if len(total_data) < 2:
        return attack_ldt, attack_hdt, attack_ldt_l, attack_hdt_l, defense_ldt, defense_hdt, defense_ldt_l, defense_hdt_l
    
    # 방향전환 이벤트 찾기
    mask_90_150 = (total_data["Direction_change"].between(90, 150)) & \
                  (total_data["Speed_mean_10"] > min_speed)
    mask_150_180 = (total_data["Direction_change"].between(150, 180)) & \
                   (total_data["Speed_mean_10"] > min_speed)
    
    filtered_90_150 = total_data[mask_90_150]
    filtered_150_180 = total_data[mask_150_180]
    
    
    # gap_sec 필터링을 위한 변수
    gap = pd.Timedelta(seconds=gap_sec)
    last_time_90_150 = None
    last_time_150_180 = None
    
    # 90-150도 방향전환 처리 - 벡터화된 계산
    x_coords = filtered_90_150['X'].values
    y_coords = filtered_90_150['Y'].values
    direction_values = filtered_90_150['Direction_smooth'].values
    indices = filtered_90_150.index
    
    for i, idx in enumerate(indices):
        # gap_sec 필터링 적용
        if (last_time_90_150 is None) or (idx - last_time_90_150 >= gap):
            # 현재 포인트의 지역 판단
            is_attack = _is_attack_side(x_coords[i], mid_long, home_side)
            
            # 블록 좌표 계산
            bx, by = point_to_block([x_coords[i], y_coords[i]], new_short, new_long)
            
            # 방향전환 정보
            prev_dir = total_data['Direction_smooth'].shift(3).loc[idx]
            curr_dir = direction_values[i]
            
            if pd.notna(prev_dir) and pd.notna(curr_dir):
                direction_info = [
                    idx,
                    [bx, by],
                    [round(prev_dir, 2), round(curr_dir, 2)]
                ]
                
                if is_attack:
                    attack_ldt += 1
                    attack_ldt_l.append(direction_info)
                else:
                    defense_ldt += 1
                    defense_ldt_l.append(direction_info)
                
                last_time_90_150 = idx
    
    # 150-180도 방향전환 처리 - 벡터화된 계산
    x_coords_150 = filtered_150_180['X'].values
    y_coords_150 = filtered_150_180['Y'].values
    direction_values_150 = filtered_150_180['Direction_smooth'].values
    indices_150 = filtered_150_180.index
    
    for i, idx in enumerate(indices_150):
        # gap_sec 필터링 적용
        if (last_time_150_180 is None) or (idx - last_time_150_180 >= gap):
            # 현재 포인트의 지역 판단
            is_attack = _is_attack_side(x_coords_150[i], mid_long, home_side)
            
            # 블록 좌표 계산
            bx, by = point_to_block([x_coords_150[i], y_coords_150[i]], new_short, new_long)
            
            # 방향전환 정보
            prev_dir = total_data['Direction_smooth'].shift(3).loc[idx]
            curr_dir = direction_values_150[i]
            
            if pd.notna(prev_dir) and pd.notna(curr_dir):
                direction_info = [
                    idx,
                    [bx, by],
                    [round(prev_dir, 2), round(curr_dir, 2)]
                ]
                
                if is_attack:
                    attack_hdt += 1
                    attack_hdt_l.append(direction_info)
                else:
                    defense_hdt += 1
                    defense_hdt_l.append(direction_info)
                
                last_time_150_180 = idx
    
    # ── 겹치는 구간(±gap) 제거 ─────────────────────
    if attack_ldt_l and attack_hdt_l:
        # 공격 지역에서 겹치는 구간 제거
        times_attack_150 = [item[0] for item in attack_hdt_l]
        attack_ldt_l = [
            item for item in attack_ldt_l
            if not any(abs(item[0] - t150) <= gap for t150 in times_attack_150)
        ]
        attack_ldt = len(attack_ldt_l)
    
    if defense_ldt_l and defense_hdt_l:
        # 수비 지역에서 겹치는 구간 제거
        times_defense_150 = [item[0] for item in defense_hdt_l]
        defense_ldt_l = [
            item for item in defense_ldt_l
            if not any(abs(item[0] - t150) <= gap for t150 in times_defense_150)
        ]
        defense_ldt = len(defense_ldt_l)
    
    return attack_ldt, attack_hdt, attack_ldt_l, attack_hdt_l, defense_ldt, defense_hdt, defense_ldt_l, defense_hdt_l

def calculate_region_sprints(total_data, mid_long, new_short, new_long, type, home_side, min_duration=0.7, max_duration=10):
    """
    전체 데이터에서 공격/수비 지역별 스프린트를 정확히 계산
    
    Args:
        total_data: 전체 데이터
        mid_long: 경계선 X 좌표
        new_short: 운동장 짧은 변 좌표
        new_long: 운동장 긴 변 좌표
        type: 선수 타입
        home_side: 쿼터 홈 방향 (east/west)
        min_duration: 최소 스프린트 지속 시간 (초)
        max_duration: 최대 스프린트 지속 시간 (초)
    
    Returns:
        tuple: (attack_s, attack_s_l, attack_tsd, attack_asd, attack_hsd, attack_lsd, 
                attack_ass, attack_hss, attack_asa, attack_hsa,
                defense_s, defense_s_l, defense_tsd, defense_asd, defense_hsd, defense_lsd,
                defense_ass, defense_hss, defense_asa, defense_hsa)
    """
    if type == "pro":
        sprint_max = 23
        acc_min = 1.0
    elif type == "amateur":
        sprint_max = 15  # 18에서 15로 낮춤
        acc_min = 0.5    # 0.8에서 0.5로 낮춤
    elif type == "youth":
        sprint_max = 13
        acc_min = 0.6
    else:
        sprint_max = 18
        acc_min = 0.8
    
    # 공격/수비 지역별 스프린트 리스트
    attack_sprints = []
    defense_sprints = []
    
    if len(total_data) < 2:
        return (0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0)
    
    attack_on_right = home_side != "east"
    
    # 스프린트 구간 찾기 - 벡터화된 계산
    sprint_mask = total_data['Speed'] >= sprint_max
    in_seg = False
    start_idx = None
    prev_idx = None
    
    # 인덱스와 값을 미리 추출
    indices = total_data.index
    speed_values = total_data['Speed'].values
    x_coords = total_data['X'].values
    
    for i, flag in enumerate(sprint_mask):
        idx = indices[i]
        if flag:
            if not in_seg:
                in_seg = True
                start_idx = idx
        else:
            if in_seg:
                end_idx = prev_idx
                dur_s = (end_idx - start_idx).total_seconds()
                if min_duration <= dur_s <= max_duration:
                    # 구간 인덱스 찾기
                    start_i = total_data.index.get_loc(start_idx)
                    end_i = total_data.index.get_loc(end_idx)
                    
                    # 벡터화된 계산
                    seg_speed = speed_values[start_i:end_i+1]
                    seg_acc = total_data['Acceleration'].values[start_i:end_i+1]
                    avg_spd = np.mean(seg_speed)
                    max_spd = np.max(seg_speed)
                    avg_acc = np.mean(seg_acc)
                    max_acc = np.max(seg_acc)
                    dist_m = (avg_spd / 3.6) * dur_s
                    
                    # 가속도 임계 적용
                    if avg_acc >= acc_min:
                        x_coord = x_coords[start_i]
                        y_coord = total_data['Y'].values[start_i]
                        block_x, block_y = point_to_block([x_coord, y_coord], new_short, new_long)
                        direction = round(total_data['Direction_smooth'].values[start_i], 2)
                        
                        sprint_info = [start_idx, end_idx, [block_x, block_y], direction,
                                     round(avg_spd, 2), round(max_spd, 2),
                                     round(avg_acc, 2), round(max_acc, 2),
                                     round(dist_m, 2), round(dur_s, 2)]
                        
                        # 스프린트 시작 지점의 지역 판단
                        is_attack = _is_attack_side(x_coord, mid_long, attack_on_right)
                        
                        if is_attack:
                            attack_sprints.append(sprint_info)
                        else:
                            defense_sprints.append(sprint_info)
                in_seg = False
        prev_idx = idx
    
    # 파일 끝에서 스프린트가 열린 채로 종료된 경우 마무리 처리
    if in_seg and prev_idx is not None:
        end_idx = prev_idx
        dur_s = (end_idx - start_idx).total_seconds()
        if min_duration <= dur_s <= max_duration:
            seg = total_data.loc[start_idx:end_idx]
            avg_spd = seg['Speed'].mean()
            max_spd = seg['Speed'].max()
            avg_acc = seg['Acceleration'].mean()
            max_acc = seg['Acceleration'].max()
            dist_m = (avg_spd / 3.6) * dur_s
            
            if avg_acc >= acc_min:
                x_coord = seg.loc[start_idx, 'X']
                y_coord = seg.loc[start_idx, 'Y']
                block_x, block_y = point_to_block([x_coord, y_coord], new_short, new_long)
                direction = round((seg.loc[start_idx, 'Direction_smooth']), 2)
                
                sprint_info = [start_idx, end_idx, [block_x, block_y], direction,
                             round(avg_spd, 2), round(max_spd, 2),
                             round(avg_acc, 2), round(max_acc, 2),
                             round(dist_m, 2), round(dur_s, 2)]
                
                is_attack = _is_attack_side(x_coord, mid_long, attack_on_right)
                
                if is_attack:
                    attack_sprints.append(sprint_info)
                else:
                    defense_sprints.append(sprint_info)
    
    # 공격 지역 스프린트 통계 계산
    attack_s = len(attack_sprints)
    attack_s_l = attack_sprints
    attack_tsd = sum([sprint[8] for sprint in attack_sprints])  # 총 거리
    attack_asd = attack_tsd / attack_s if attack_s > 0 else 0  # 평균 거리
    attack_hsd = max([sprint[8] for sprint in attack_sprints]) if attack_sprints else 0  # 최장 거리
    attack_lsd = min([sprint[8] for sprint in attack_sprints]) if attack_sprints else 0  # 최단 거리
    attack_ass = sum([sprint[4] for sprint in attack_sprints]) / attack_s if attack_s > 0 else 0  # 평균 속력
    attack_hss = max([sprint[5] for sprint in attack_sprints]) if attack_sprints else 0  # 최고 속력
    attack_asa = sum([sprint[6] for sprint in attack_sprints]) / attack_s if attack_s > 0 else 0  # 평균 가속도
    attack_hsa = max([sprint[7] for sprint in attack_sprints]) if attack_sprints else 0  # 최고 가속도
    
    # 수비 지역 스프린트 통계 계산
    defense_s = len(defense_sprints)
    defense_s_l = defense_sprints
    defense_tsd = sum([sprint[8] for sprint in defense_sprints])  # 총 거리
    defense_asd = defense_tsd / defense_s if defense_s > 0 else 0  # 평균 거리
    defense_hsd = max([sprint[8] for sprint in defense_sprints]) if defense_sprints else 0  # 최장 거리
    defense_lsd = min([sprint[8] for sprint in defense_sprints]) if defense_sprints else 0  # 최단 거리
    defense_ass = sum([sprint[4] for sprint in defense_sprints]) / defense_s if defense_s > 0 else 0  # 평균 속력
    defense_hss = max([sprint[5] for sprint in defense_sprints]) if defense_sprints else 0  # 최고 속력
    defense_asa = sum([sprint[6] for sprint in defense_sprints]) / defense_s if defense_s > 0 else 0  # 평균 가속도
    defense_hsa = max([sprint[7] for sprint in defense_sprints]) if defense_sprints else 0  # 최고 가속도
    
    return (attack_s, attack_s_l, attack_tsd, attack_asd, attack_hsd, attack_lsd, 
            attack_ass, attack_hss, attack_asa, attack_hsa,
            defense_s, defense_s_l, defense_tsd, defense_asd, defense_hsd, defense_lsd,
            defense_ass, defense_hss, defense_asa, defense_hsa)
            
# ===============================================
# 데이터 품질(노이즈/신뢰도) 계산
# ===============================================
def compute_data_quality(hz, data: pd.DataFrame, quarter_data: pd.DataFrame):
    """
    GPS 데이터 품질 분석 및 노이즈 점수 계산
    
    Args:
        hz (int): GPS 데이터 수집 주파수 (Hz)
        data (pd.DataFrame): 전체 GPS 데이터
        quarter_data (pd.DataFrame): 쿼터별 GPS 데이터
    
    Returns:
        tuple: (noise_score, reliability, quality_metrics)
            - noise_score (float): 노이즈 점수 (0-100, 높을수록 나쁨)
            - reliability (int): 신뢰성 점수 (0-100, 높을수록 좋음)
            - quality_metrics (dict): 품질 지표들
    """
    # 1단계: 입력 데이터 검증 및 기본 설정
    if data is None or data.empty:
        return 100.0, 0, {
            "time_continuity": 0.0,
            "inaccuracy": 100.0,
        }
    
    expected_freq = hz
    
    if not data.empty:
        if quarter_data is not None and not quarter_data.empty:
            quarter_start = quarter_data.index[0]
            quarter_end = quarter_data.index[-1]
            total_duration_seconds = (quarter_end - quarter_start).total_seconds()
        else:
            start_time = data.index[0]
            end_time = data.index[-1]
            total_duration_seconds = (end_time - start_time).total_seconds()
        
        ideal_data_count = total_duration_seconds * expected_freq
        actual_data_count = len(data)
        data_density = (actual_data_count / ideal_data_count) * 100.0 if ideal_data_count > 0 else 0.0
        data_density = max(0.0, min(100.0, data_density))
    else:
        total_duration_seconds = 0.0
        ideal_data_count = 0.0
        actual_data_count = 0
        data_density = 0.0
    
    # GPS 정확도 계산을 위한 컴포넌트 리스트
    gps_accuracy_components = []
    
    if quarter_data is not None and not quarter_data.empty and len(quarter_data) > 1:
        # 3-1: 속력 기반 GPS 검증
        if 'Speed' in quarter_data.columns:
            zero_speed_mask = quarter_data['Speed'] < 0.1
            if zero_speed_mask.sum() > 0:
                zero_speed_data = quarter_data[zero_speed_mask].copy()
                if len(zero_speed_data) > 1:
                    x_coords = zero_speed_data['X'].values
                    y_coords = zero_speed_data['Y'].values
                    dx = np.diff(x_coords)
                    dy = np.diff(y_coords)
                    distances = np.sqrt(dx*dx + dy*dy)
                    gps_error_count = (distances > 0.5).sum()
                    total_zero_speed = len(zero_speed_data)
                    zero_speed_accuracy = max(0.0, 100.0 - (gps_error_count / total_zero_speed * 100.0))
                    gps_accuracy_components.append(zero_speed_accuracy)

        
        # 3-2: 가속도 기반 GPS 검증
        if 'Acceleration' in quarter_data.columns:
            acc_diff_prev = np.abs(quarter_data['Acceleration'].diff())
            acc_diff_next = np.abs(quarter_data['Acceleration'].diff(-1))
            gps_jump_mask = (acc_diff_prev > 10.0) & (acc_diff_next > 10.0)
            unrealistic_acceleration = gps_jump_mask.sum()
            total_points = len(quarter_data)
            if total_points > 0:
                acceleration_accuracy = max(0.0, 100.0 - (unrealistic_acceleration / total_points * 100.0))
                gps_accuracy_components.append(acceleration_accuracy)
        
        # 3-3: 위치 변화 일관성 검증
        if 'X' in quarter_data.columns and 'Y' in quarter_data.columns:
            x_coords = quarter_data['X'].values
            y_coords = quarter_data['Y'].values
            dx1 = np.diff(x_coords[:-1])
            dy1 = np.diff(y_coords[:-1])
            dist1 = np.sqrt(dx1*dx1 + dy1*dy1)
            dx2 = np.diff(x_coords[1:])
            dy2 = np.diff(y_coords[1:])
            dist2 = np.sqrt(dx2*dx2 + dy2*dy2)
            consistent_mask = np.abs(dist1 - dist2) < 5.0
            consistent_movement = consistent_mask.sum()
            total_movements = len(dist1)
            if total_movements > 0:
                consistency_accuracy = (consistent_movement / total_movements) * 100.0
                gps_accuracy_components.append(consistency_accuracy)

        
        # GPS 정확도 종합 계산
        if gps_accuracy_components:
            gps_accuracy = sum(gps_accuracy_components) / len(gps_accuracy_components)
            gps_accuracy = max(0.0, min(100.0, gps_accuracy))
        else:
            gps_accuracy = 0.0
    else:
        # fallback 방식
        if 'X' in data.columns and 'Y' in data.columns and len(data) > 1:
            distances = []
            for i in range(len(data) - 1):
                try:
                    x1, y1 = data.iloc[i]['X'], data.iloc[i]['Y']
                    x2, y2 = data.iloc[i+1]['X'], data.iloc[i+1]['Y']
                    
                    # 이미 미터 단위이므로 직접 거리 계산
                    dx = x2 - x1
                    dy = y2 - y1
                    distance = np.sqrt(dx*dx + dy*dy)
                    distances.append(distance)
                except:
                    continue
            
            if distances:
                # 거리가 너무 작거나 너무 큰 경우를 GPS 오류로 판단
                gps_noise_pct = float((np.array(distances) < 0.1).mean() * 100.0)  # 10cm 미만
                gps_unrealistic_pct = float((np.array(distances) > 50.0).mean() * 100.0)  # 50m 이상
                gps_accuracy = 100.0 - (gps_noise_pct + gps_unrealistic_pct)
                gps_accuracy = max(0.0, min(100.0, gps_accuracy))
            else:
                gps_accuracy = 0.0
        else:
            gps_accuracy = 0.0

    

    
    # 4단계: 노이즈 점수 및 신뢰성 계산
    noise_score = (
        0.6 * (100.0 - data_density) +      # 데이터 밀도 부족 (60% 가중치)
        0.4 * (100.0 - gps_accuracy)       # GPS 정확도 부족 (40% 가중치)
    )
    noise_score = float(max(0.0, min(100.0, noise_score)))
    reliability = int(round(100.0 - noise_score))
    

    
    # 결과 딕셔너리 생성
    qc = {
        "time_continuity": round(data_density, 1),
        "inaccuracy": round(100.0 - gps_accuracy, 1),
        "total_duration_seconds": round(total_duration_seconds, 1),
        "ideal_data_count": int(ideal_data_count),
        "actual_data_count": actual_data_count,
        "data_density": round(data_density, 1),
        "gps_accuracy": round(gps_accuracy, 1),
    }
    
    return noise_score, reliability, qc

# ===============================================
# 두번째 계산
# ===============================================
def second_cal(data):
    """
    쿼터 내 전반/후반 평균속도 및 페이스 저하율 계산
    
    Args:
        data (pd.DataFrame): GPS 데이터프레임
    
    Returns:
        tuple: (Q1_AS, Q2_AS, Drop_AS)
            - Q1_AS: 전반(시간 절반) 평균속도 (km/h)
            - Q2_AS: 후반 평균속도 (km/h)
            - Drop_AS: 페이스 저하율 (%) = (Q1_AS - Q2_AS) / Q1_AS * 100
    """
    """쿼터 내 전반/후반 평균속도 및 페이스 저하율 계산.

    - Q1_AS: 전반(시간 절반) 평균속도
    - Q2_AS: 후반 평균속도
    - Drop_AS: (Q1_AS - Q2_AS) / max(Q1_AS, eps) * 100
    """
    if not data['Speed'].empty:
        game_duration = (data.index[-1] - data.index[0]).total_seconds()
        split_point = data.index[0] + pd.Timedelta(seconds=game_duration / 2)
        first_half = data.loc[data.index <= split_point]
        second_half = data.loc[data.index > split_point]
        Q1_AS = first_half['Speed'].mean() if not first_half['Speed'].empty else 0
        Q2_AS = second_half['Speed'].mean() if not second_half['Speed'].empty else 0
        eps = 1e-6
        Drop_AS = ((Q1_AS - Q2_AS) / max(Q1_AS, eps)) * 100 if Q1_AS > 0 else 0
    else:
        Q1_AS = 0
        Q2_AS = 0
        Drop_AS = 0

    return Q1_AS, Q2_AS, Drop_AS

# ===============================================
# 방향 변화량 계산
# ===============================================
def direction_cal(data, new_short, new_long, type, gap_sec=5):
    """
    방향 전환 분석 (90-150°, 150-180° 각도 변화)
    
    Args:
        data (pd.DataFrame): GPS 데이터프레임
        new_short (list): 운동장 짧은 변 좌표 [min, max]
        new_long (list): 운동장 긴 변 좌표 [min, max]
        type (str): 선수 타입 (pro, amateur, youth) - 최소 속도 기준 결정
        gap_sec (int): 방향 전환 간 최소 시간 간격 (초)
    
    Returns:
        tuple: (T_LDT, T_HDT, T_LDT_L, T_HDT_L)
            - T_LDT: 90-150° 방향전환 횟수
            - T_HDT: 150-180° 방향전환 횟수
            - T_LDT_L: 90-150° 방향전환 리스트
            - T_HDT_L: 150-180° 방향전환 리스트
    """
    
    # 선수 타입별 최소 속도 기준 설정
    print(f"[방향전환] 전달받은 type 파라미터: '{type}' (타입: {type.__class__.__name__})")
    
    if type == "pro":
        min_speed = 8
        print(f"[방향전환] 프로 선수: min_speed={min_speed}km/h")
    elif type == "amateur":
        min_speed = 6
        print(f"[방향전환] 아마추어 선수: min_speed={min_speed}km/h")
    elif type == "youth":
        min_speed = 4
        print(f"[방향전환] 유소년 선수: min_speed={min_speed}km/h")
    else:
        # 알 수 없는 타입은 amateur 기준 사용
        min_speed = 6
        print(f"[방향전환] ⚠️ 알 수 없는 선수 타입: '{type}', amateur 기준 사용 (min_speed={min_speed}km/h)")
        
    direction_change_90_150 = []
    direction_change_150_180 = []

    gap = pd.Timedelta(seconds=gap_sec)

    # ── 공통 도움 함수 ───────────────────────────────────────
    def append_if_valid(lst, idx, block_x, block_y):
        prev_dir = data['Direction_smooth'].shift(3).loc[idx]
        curr_dir = data.loc[idx, 'Direction_smooth']

        # NaN 검사 → 둘 다 숫자일 때만 append
        if pd.notna(prev_dir) and pd.notna(curr_dir):
            lst.append([
                idx,
                [block_x, block_y],
                [round(prev_dir, 2), round(curr_dir, 2)]
            ])
            return True        # 성공적으로 추가됨
        return False           # NaN 때문에 건너뜸

    # ── ① 90~150° 구간 ──────────────────────────────────────
    mask_90_150 = (data["Direction_change"].between(90, 150)) & \
                  (data["Speed_mean_10"] > min_speed)
    filtered_90_150 = data[mask_90_150]

    last_time = None
    for idx, row in filtered_90_150.iterrows():
        if (last_time is None) or (idx - last_time >= gap):
            bx, by = point_to_block([row['X'], row['Y']], new_short, new_long)
            if append_if_valid(direction_change_90_150, idx, bx, by):
                last_time = idx

    # ── ② 150~180° 구간 ─────────────────────────────────────
    mask_150_180 = (data["Direction_change"].between(150, 180)) & \
                   (data["Speed_mean_10"] > min_speed)
    filtered_150_180 = data[mask_150_180]

    last_time = None
    for idx, row in filtered_150_180.iterrows():
        if (last_time is None) or (idx - last_time >= gap):
            bx, by = point_to_block([row['X'], row['Y']], new_short, new_long)
            if append_if_valid(direction_change_150_180, idx, bx, by):
                last_time = idx
                
    # ── ③ 겹치는 구간(±gap) 제거 ─────────────────────
    if direction_change_90_150 and direction_change_150_180:
        times_150 = [item[0] for item in direction_change_150_180]
        direction_change_90_150 = [
            item for item in direction_change_90_150
            if not any(abs(item[0] - t150) <= gap for t150 in times_150)
        ]

    return (len(direction_change_90_150),
            len(direction_change_150_180),
            direction_change_90_150,
            direction_change_150_180)
        
# ===============================================
# 스프린트 계산
# ===============================================
def sprint_cal(data, new_short, new_long, type, min_duration = 0.7, max_duration = 10):
    """
    스프린트 분석 (고속 구간 식별 및 통계)
    
    Args:
        data (pd.DataFrame): GPS 데이터프레임
        new_short (list): 운동장 짧은 변 좌표 [min, max]
        new_long (list): 운동장 긴 변 좌표 [min, max]
        type (str): 선수 타입 (pro, amateur, youth) - 스프린트 속도 기준 결정
        min_duration (float): 최소 스프린트 지속 시간 (초)
        max_duration (float): 최대 스프린트 지속 시간 (초)
    
    Returns:
        tuple: (T_S, T_S_L, T_TSD, T_ASD, T_HSD, T_LSD, T_ASS, T_HSS, T_ASA, T_HSA)
            - T_S: 스프린트 횟수
            - T_S_L: 스프린트 이벤트 리스트
            - T_TSD: 스프린트 총 거리 (m)
            - T_ASD: 스프린트 평균 거리 (m)
            - T_HSD: 스프린트 최장 거리 (m)
            - T_LSD: 스프린트 최단 거리 (m)
            - T_ASS: 스프린트 평균 속력 (km/h)
            - T_HSS: 스프린트 최고 속력 (km/h)
            - T_ASA: 스프린트 평균 가속도 (m/s²)
            - T_HSA: 스프린트 최고 가속도 (m/s²)
    """
    if type == "pro":
        sprint_max = 23
        acc_min = 1.6
    elif type == "amateur":
        sprint_max = 18  
        acc_min = 1.3    
    elif type == "youth":
        sprint_max = 15
        acc_min = 1.0
        
    sprint = data['Speed'] >= sprint_max 
    in_seg = False
    start_idx = None
    prev_idx  = None
    results = []
    total_sprint_dist = []
    total_sprint_spd = []
    total_sprint_acc = []
    for idx, flag in sprint.items():
        if flag:
            if not in_seg:              
                in_seg = True
                start_idx = idx
        else:
            if in_seg:                  
                end_idx = prev_idx      
                dur_s = (end_idx - start_idx).total_seconds()
                if min_duration <= dur_s <= max_duration:
                    seg = data.loc[start_idx:end_idx]
                    avg_spd = seg['Speed'].mean()
                    max_spd = seg['Speed'].max()
                    avg_acc = seg['Acceleration'].mean()
                    max_acc = seg['Acceleration'].max()
                    dist_m  = (avg_spd / 3.6) * dur_s      # km/h → m/s 변환 후 적분
                    # 스프린트 인식 보강: 가속도 임계 적용
                    if not (avg_acc >= acc_min):
                        in_seg = False
                        prev_idx = idx
                        continue
                    x_coord = seg.loc[start_idx, 'X']
                    y_coord = seg.loc[start_idx, 'Y']
                    block_x, block_y = point_to_block([x_coord, y_coord], new_short, new_long)
                    direction = round((seg.loc[start_idx, 'Direction_smooth']), 2)
                    total_sprint_dist.append(dist_m)
                    total_sprint_acc.append(avg_acc)
                    total_sprint_spd.append(avg_spd)
                    results.append([start_idx, end_idx, [block_x, block_y], direction,
                                    round(avg_spd, 2), round(max_spd, 2),
                                    round(avg_acc, 2), round(max_acc, 2),
                                    round(dist_m, 2), round(dur_s, 2)])
                in_seg = False
        prev_idx = idx
    # 파일 끝에서 스프린트가 열린 채로 종료된 경우 마무리 처리
    if in_seg and prev_idx is not None:
        end_idx = prev_idx
        dur_s = (end_idx - start_idx).total_seconds()
        if min_duration <= dur_s <= max_duration:
            seg = data.loc[start_idx:end_idx]
            avg_spd = seg['Speed'].mean()
            max_spd = seg['Speed'].max()
            avg_acc = seg['Acceleration'].mean()
            max_acc = seg['Acceleration'].max()
            dist_m  = (avg_spd / 3.6) * dur_s
            if avg_acc >= acc_min:
                x_coord = seg.loc[start_idx, 'X']
                y_coord = seg.loc[start_idx, 'Y']
                block_x, block_y = point_to_block([x_coord, y_coord], new_short, new_long)
                direction = round((seg.loc[start_idx, 'Direction_smooth']), 2)
                total_sprint_dist.append(dist_m)
                total_sprint_acc.append(avg_acc)
                total_sprint_spd.append(avg_spd)
                results.append([start_idx, end_idx, [block_x, block_y], direction,
                                round(avg_spd, 2), round(max_spd, 2),
                                round(avg_acc, 2), round(max_acc, 2),
                                round(dist_m, 2), round(dur_s, 2)])
    if len(total_sprint_dist) > 0:
        TSD = sum(total_sprint_dist)
        ASD = sum(total_sprint_dist)/len(total_sprint_dist)
        HSD = max(total_sprint_dist)
        # 최소 거리(>0) 계산
        positive_dists = [d for d in total_sprint_dist if d > 0]
        LSD = min(positive_dists) if positive_dists else 0
    else:
        TSD = 0
        ASD = 0
        HSD = 0
        LSD = 0
        
    if len(total_sprint_spd) > 0:
        ASS = sum(total_sprint_spd)/len(total_sprint_spd)
        HSS = max(total_sprint_spd)
    else:
        ASS = 0
        HSS = 0
        
    if len(total_sprint_acc) > 0:
        ASA = sum(total_sprint_acc)/len(total_sprint_acc)
        HSA = max(total_sprint_acc)
    else:
        ASA = 0
        HSA = 0
    
    # LSD 제거 (민감 지표 제외)
    return len(results), results, TSD, ASD, HSD, LSD, ASS, HSS, ASA, HSA
            
# ===============================================
# 공격, 수비 포인트 계산
# ===============================================
def cal_point(stats, alpha: str, player_type: str) -> float:
    """
    공격/수비 포인트 계산
    
    Args:
        stats (dict): 통계 데이터
        alpha (str): 구분자 ('A' for attack, 'D' for defense)
        player_type (str): 선수 타입 (pro, amateur, youth)
    
    Returns:
        float: 계산된 포인트 (0-100)
    """
    """공격/수비 포인트: 활동면적과 체류비율을 분포기반 0-100 정규화 후 50/50 가중합."""
    cfg = _get_type_config(player_type)

    def norm(val: float, a: float, b: float, invert: bool = False) -> float:
        if a == b:
            return 0.0
        s = (val - a) / (b - a)
        s = max(0.0, min(1.0, s))
        s = 1.0 - s if invert else s
        return s * 100.0

    mr = float(stats.get(f"{alpha}_MR", 0.0))
    tpt = float(stats.get(f"{alpha}_TPT", 0.0))
    mr_score = norm(mr, cfg["MR"][0], cfg["MR"][1])
    tpt_score = norm(tpt, cfg["TPT"][0], cfg["TPT"][1])
    return max(0.0, min(100.0, 0.5 * mr_score + 0.5 * tpt_score))
    
# ===============================================
# 스태미나 포인트 계산
# ===============================================
def cal_stamina_point(stats, player_type: str) -> float:
    """스태미나: DPM(60) + MR(20) + SDPD(10) + Drop_AS 역(10) → 0-100"""
    cfg = _get_type_config(player_type)

    def norm(val: float, a: float, b: float, invert: bool = False) -> float:
        if a == b:
            return 0.0
        s = (val - a) / (b - a)
        s = max(0.0, min(1.0, s))
        s = 1.0 - s if invert else s
        return s * 100.0

    dpm = float(stats.get("T_DPM", 0.0))
    mr = float(stats.get("T_MR", 0.0))
    sdpd = float(stats.get("T_SDPD", 0.0))
    drop = float(stats.get("T_Drop_AS", 0.0))

    dpm_s = norm(dpm, cfg["DPM"][0], cfg["DPM"][1])
    mr_s = norm(mr, cfg["MR"][0], cfg["MR"][1])
    sdpd_s = norm(sdpd, cfg["SDPD"][0], cfg["SDPD"][1])
    drop_s = norm(drop, cfg["DROP_AS"][0], cfg["DROP_AS"][1], invert=True)

    score = 0.6 * dpm_s + 0.2 * mr_s + 0.1 * sdpd_s + 0.1 * drop_s
    return max(0.0, min(100.0, score))

# ===============================================
# 적극성성 포인트 계산
# ===============================================
def cal_positiveness_point(stats, player_type: str) -> float:
    """적극성: 분당(10분당) 방향전환/스프린트 비율 + MR 일부 반영."""
    cfg = _get_type_config(player_type)

    def norm(val: float, a: float, b: float) -> float:
        if a == b:
            return 0.0
        s = (val - a) / (b - a)
        s = max(0.0, min(1.0, s))
        return s * 100.0

    minutes = max(1.0, float(stats.get("T_T", 0.0)))
    scale = 10.0 / minutes
    ldtm = float(stats.get("T_LDT", 0.0)) * scale
    hdtm = float(stats.get("T_HDT", 0.0)) * scale
    sm = float(stats.get("T_S", 0.0)) * scale
    mr = float(stats.get("T_MR", 0.0))

    ldt_s = norm(ldtm, cfg["LDTm"][0], cfg["LDTm"][1])
    hdt_s = norm(hdtm, cfg["HDTm"][0], cfg["HDTm"][1])
    s_s = norm(sm, cfg["Sm"][0], cfg["Sm"][1])
    mr_s = norm(mr, cfg["MR"][0], cfg["MR"][1])

    score = 0.4 * ldt_s + 0.4 * hdt_s + 0.1 * s_s + 0.1 * mr_s
    return max(0.0, min(100.0, score))

# ===============================================
# 속도 포인트 계산
# ===============================================
def cal_speed_point(stats, player_type: str) -> float:
    cfg = _get_type_config(player_type)
    def norm(val: float, a: float, b: float) -> float:
        if a == b:
            return 0.0
        s = (val - a) / (b - a)
        s = max(0.0, min(1.0, s)) * 100.0
        return s
    AS = float(stats.get("T_AS", 0.0))
    HS = float(stats.get("T_HS", 0.0))
    as_s = norm(AS, cfg["AS"][0], cfg["AS"][1])
    hs_s = norm(HS, cfg["HS"][0], cfg["HS"][1])
    return max(0.0, min(100.0, 0.4 * as_s + 0.6 * hs_s))

# ===============================================
# 가속도 포인트 계산
# ===============================================
def cal_acceleration_point(stats, player_type: str) -> float:
    cfg = _get_type_config(player_type)
    def norm(val: float, a: float, b: float) -> float:
        if a == b:
            return 0.0
        s = (val - a) / (b - a)
        s = max(0.0, min(1.0, s)) * 100.0
        return s
    AA = float(stats.get("T_AA", 0.0))
    HA = float(stats.get("T_HA", 0.0))
    aa_s = norm(AA, cfg["AA"][0], cfg["AA"][1])
    ha_s = norm(HA, cfg["HA"][0], cfg["HA"][1])
    return max(0.0, min(100.0, 0.4 * aa_s + 0.6 * ha_s))

# ===============================================
# 스프린트 포인트 계산
# ===============================================
def cal_sprint_point(stats, player_type: str) -> float:
    """스프린트 점수: S(10) + ASS(35) + ASD(30) + HSD(25), S는 분당(10분당)."""
    cfg = _get_type_config(player_type)

    def norm(val: float, a: float, b: float) -> float:
        if a == b:
            return 0.0
        s = (val - a) / (b - a)
        s = max(0.0, min(1.0, s)) * 100.0
        return s

    minutes = max(1.0, float(stats.get("T_T", 0.0)))
    scale = 10.0 / minutes
    Sm = float(stats.get("T_S", 0.0)) * scale
    ASS = float(stats.get("T_ASS", 0.0))
    ASD = float(stats.get("T_ASD", 0.0))
    HSD = float(stats.get("T_HSD", 0.0))

    s_s  = norm(Sm, cfg["Sm"][0], cfg["Sm"][1])
    ass_s = norm(ASS, cfg["ASS"][0], cfg["ASS"][1])
    asd_s = norm(ASD, cfg["ASD"][0], cfg["ASD"][1])
    hsd_s = norm(HSD, cfg["HSD"][0], cfg["HSD"][1])

    score = 0.10 * s_s + 0.35 * ass_s + 0.30 * asd_s + 0.25 * hsd_s
    return max(0.0, min(100.0, score))

def _get_type_config(player_type: str) -> dict:
    """모든 타입에 동일한 범위 설정. DB 허용 범위 기준."""
    return {
        # 기존 항목들
        "DPM": (0.0, 500.0),         # DB 허용: 0~500 - 1분당 이동거리
        "MR": (0.0, 90.0),           # DB 허용: 0~90 - 활동 면적
        "SDPD": (0.0, 50.0),         # DB 허용: 0~50 - 총 이동거리 당 스프린트 거리 비율
        "DROP_AS": (0.0, 50.0),      # DB 허용: 0~50 - 전반 후반 속도 차이
        "AS": (0.0, 50.0),           # DB 허용: 0~50 - 평균속력
        "HS": (0.0, 50.0),           # DB 허용: 0~50 - 최고속력
        "AA": (0.0, 20.0),           # DB 허용: 0~20 - 평균 가속도
        "HA": (0.0, 20.0),           # DB 허용: 0~20 - 최고 가속도
        "LDTm": (0.0, 100.0),        # DB 허용: 0~100 - 90-150° 방향전환 횟수
        "HDTm": (0.0, 100.0),        # DB 허용: 0~100 - 150-180° 방향전환 횟수
        "Sm": (0.0, 100.0),          # DB 허용: 0~100 - 스프린트 횟수
        "ASS": (0.0, 50.0),          # DB 허용: 0~50 - 스프린트 평균속력
        "ASD": (0.0, 50.0),          # DB 허용: 0~50 - 스프린트 평균 거리
        "HSD": (0.0, 50.0),          # DB 허용: 0~50 - 스프린트 최장 거리
        "TPT": (0.0, 100.0),         # DB 허용: 0~100 - 해당 시간 비율
        
        # 누락된 항목들 추가
        "D": (0.0, 100.0),           # DB 허용: 0~100 - 이동거리 (km)
        "T": (0.0, 500.0),           # DB 허용: 0~500 - 이동시간 (분)
        "TSD": (0.0, 1000.0),        # DB 허용: 0~1000 - 스프린트 총 거리 (m)
        "LSD": (0.0, 50.0),          # DB 허용: 0~50 - 스프린트 최소 거리 (m)
        "HSS": (0.0, 50.0),          # DB 허용: 0~50 - 스프린트 최고속력 (km/h)
        "ASA": (0.0, 20.0),          # DB 허용: 0~20 - 스프린트 평균가속도 (m/s²)
        "HSA": (0.0, 20.0),          # DB 허용: 0~20 - 스프린트 최고가속도 (m/s²)
        
        # 추가 확인 필요 항목들
        "HTS": (0.0, 50.0),          # DB 허용: 0~50 - 상위 10% 속력 (km/h)
        "LTS": (0.0, 50.0),          # DB 허용: 0~50 - 하위 10% 속력 (km/h)
        "GS": (0.0, 50.0),           # DB 허용: 0~50 - 상위-하위 속력 차 (km/h)
        "Q1_AS": (0.0, 50.0),        # DB 허용: 0~50 - 전반 평균속력 (km/h)
        "Q2_AS": (0.0, 50.0),        # DB 허용: 0~50 - 후반 평균속력 (km/h)
        
        # 분석 타입
        "AN_T": player_type,         # DB 타입: ENUM('youth','amateur','pro') - 사용자 레벨
    }
            
# ===============================================
# 속력, 가속도 리스트 계산
# ===============================================
def get_list(df, n_segments: int = 10, col: str = "Speed"):
    """
    데이터를 n개 구간으로 나누어 각 구간의 평균값 계산
    
    Args:
        df (pd.DataFrame): GPS 데이터프레임
        n_segments (int): 구간 개수 (기본값: 10)
        col (str): 분석할 컬럼명 (기본값: "Speed")
    
    Returns:
        list: 각 구간의 평균값 리스트 (숫자형)
    """
    # 전처리: DataFrame·컬럼 확인
    if df.empty or col not in df.columns:
        return []

    # 데이터가 충분하지 않으면 빈 리스트 반환
    if len(df) < n_segments:
        return []

    start, end = df.index.min(), df.index.max()
    if start == end:                 # 데이터가 1시점뿐 → 불충분
        return []

    # n_segments + 1 개 경계 시점
    try:
        boundaries = pd.date_range(start=start, end=end, periods=n_segments + 1)
    except Exception:
        # date_range 실패시 인덱스 기반으로 구간 나누기
        total_len = len(df)
        segment_size = total_len // n_segments
        if segment_size == 0:
            return []
        
        means = []
        for i in range(n_segments):
            start_idx = i * segment_size
            end_idx = (i + 1) * segment_size if i < n_segments - 1 else total_len
            seg = df.iloc[start_idx:end_idx]
            
            if seg.empty or col not in seg.columns:
                continue
                
            mean_val = seg[col].mean()
            if pd.isna(mean_val):
                continue
                
            means.append(round(float(mean_val), 2))
        
        return means

    means = []
    for i in range(n_segments):
        try:
            seg = df.loc[(df.index >= boundaries[i]) & (df.index < boundaries[i + 1])]
            if seg.empty:
                continue
                
            mean_val = seg[col].mean()
            if pd.isna(mean_val):
                continue
                
            means.append(round(float(mean_val), 2))
        except Exception:
            continue

    return means

def _ensure_list_length(data_list, target_length: int = 100):
    """리스트를 지정된 길이로 맞춤 (데이터가 있을 때만)"""
    # 데이터가 없으면 빈 리스트 반환
    if not data_list or not isinstance(data_list, list):
        return []
    
    # 숫자로 변환
    numeric_list = []
    for item in data_list:
        try:
            if isinstance(item, str):
                numeric_list.append(float(item))
            else:
                numeric_list.append(float(item))
        except (ValueError, TypeError):
            continue  # 변환 실패한 항목은 제외
    
    # 변환된 데이터가 없으면 빈 리스트 반환
    if not numeric_list:
        return []
    
    if len(numeric_list) == target_length:
        return [round(x, 2) for x in numeric_list]
    elif len(numeric_list) < target_length:
        # 부족하면 마지막 값으로 패딩 (데이터가 있는 경우에만)
        last_value = numeric_list[-1]
        padded = numeric_list + [last_value] * (target_length - len(numeric_list))
        return [round(x, 2) for x in padded]
    else:
        # 초과하면 균등 샘플링
        step = len(numeric_list) / target_length
        indices = [int(i * step) for i in range(target_length)]
        sampled = [numeric_list[i] for i in indices]
        return [round(x, 2) for x in sampled]
            
# ===============================================
# 선수 분석 
# ===============================================
# 메인 분석 함수
# ===============================================
def player_anal(hz, raw_data_file, upload_file, ground_name=None, standard=None, quarter_info=None, type='amateur', ground_dict=None):
    """
    선수 분석 메인 함수
    
    Args:
        hz (int): GPS 데이터 수집 주파수 (Hz)
        raw_data_file (str): 원본 GPS 데이터 파일 경로
        upload_file (str): 편집된 GPS 데이터 파일 경로
        ground_name (str, optional): 운동장 이름 (ground_dict 미사용 시)
        standard (str): 기준점 (north, south, east, west)
        quarter_info (dict): 쿼터 정보 (시작/종료 시간, 상태 등)
        type (str): 선수 타입 (pro, amateur, youth)
        ground_dict (dict, optional): 운동장 정보 딕셔너리 (우선 사용)
            - center: [lat, lon]
            - rotate_deg: float
            - new_short: [min, max]
            - new_long: [min, max]
    
    Returns:
        dict: 쿼터별 분석 결과 (total, attack, defense, point, noise)
    """
    
    # 1. CSV 파일 읽기 및 데이터 로드
    df_input = pd.read_csv(upload_file)
    
    # CSV 데이터를 기존 형식으로 변환 (rotate 함수 호환을 위해)
    lines_list = []
    for _, row in df_input.iterrows():
        line = f"{row['device_id']}/{row['datetime']}/{row['x_utm']}/{row['y_utm']}"
        lines_list.append(line)
    
    # 2. GPS 좌표 회전 (이미 UTM 좌표이므로 회전만 수행)
    if ground_dict is not None:
        # ground_dict를 직접 전달
        gps_data = rotate(lines_list, ground_dict=ground_dict)
    else:
        # 기존 방식 (하위 호환성)
        gps_data = rotate(lines_list, ground_name)
    
    data_str = "\n".join(gps_data)
    data_io = StringIO(data_str)
    
    # 3. 그라운드 데이터 로드
    if ground_dict is not None:
        # ground_dict에서 직접 사용
        new_short = ground_dict["new_short"]
        new_long = ground_dict["new_long"]
    else:
        # 기존 방식 (하위 호환성)
        ground = load_json_file('ground_data.json')
        for item in ground:
            if item["ground_name"] == ground_name:
                ground_data = item
                break
        new_short = ground_data["new_short"]
        new_long = ground_data["new_long"]
    
    # 4. CSV 파싱 및 데이터프레임 생성
    raw_df = pd.read_csv(data_io, delimiter='/', names=['ID', 'DateTime', 'X', 'Y'])
    raw_df['DateTime'] = pd.to_datetime(raw_df['DateTime'], format='%Y.%m.%d.%H.%M.%S.%f')
    raw_df.set_index('DateTime', inplace=True)
    raw_df = raw_df.astype({'X': 'float64', 'Y': 'float64'})
    
    # 5. 그라운드 범위 필터링
    print(f"[분석] 필터링 전 데이터 건수: {len(raw_df)}")
    print(f"[분석] 필터링 범위 - X: [{new_long[0]-1}, {new_long[1]+1}], Y: [{new_short[0]-1}, {new_short[1]+1}]")
    if len(raw_df) > 0:
        print(f"[분석] 실제 데이터 범위 - X: [{raw_df['X'].min()}, {raw_df['X'].max()}], Y: [{raw_df['Y'].min()}, {raw_df['Y'].max()}]")
    
    df = raw_df[
        (raw_df["Y"] >= new_short[0] - 1) &
        (raw_df["Y"] <= new_short[1] + 1) &
        (raw_df["X"] >= new_long[0] - 1) &
        (raw_df["X"] <= new_long[1] + 1)
    ].copy()
    
    print(f"[분석] 필터링 후 데이터 건수: {len(df)}")
    if len(df) == 0:
        print(f"[분석] ⚠️ 경고: 필터링 후 데이터가 없습니다! Ground 범위를 확인하세요.")
    
    # 6. 속도 계산
    step = 15
    dx   = df['X'].shift(-step) - df['X']    # X 거리 (현재 → step칸 뒤)
    dy   = df['Y'].shift(-step) - df['Y']    # Y 거리
    dt   = (df.index.to_series().shift(-step) - df.index.to_series()).dt.total_seconds()

    # 속도 계산 (km/h) - 수치 안정화 (dt<=0, NaN 방지, 비현실적 이상치 제거)
    with np.errstate(divide='ignore', invalid='ignore'):
        speed_raw = np.where((dt > 0) & np.isfinite(dt), (np.sqrt(dx**2 + dy**2) / dt) * 3.6, np.nan)
    df['Speed_raw'] = pd.Series(speed_raw, index=df.index)
    # 스무딩 및 상한 클리핑(노이즈 컷)
    df['Speed'] = df['Speed_raw'].rolling(window=5, center=True).mean()
    df['Speed'] = df['Speed'].clip(lower=0, upper=40)
    df['Speed_mean_5'] = df['Speed'].rolling(window=5, center=True).mean()
    df['Speed_mean_10'] = df['Speed'].rolling(window=10, center=True).mean()
    df['Speed_mean_20'] = df['Speed'].rolling(window=20, center=True).mean()
    
    # 7. 가속도 계산
    # 가속도 계산(m/s^2) - 수치 안정화
    dt1 = df.index.to_series().diff().dt.total_seconds()
    with np.errstate(divide='ignore', invalid='ignore'):
        acc = (df['Speed'].diff() / dt1) * (1 / 3.6)
    # 기존 로직 호환을 위해 절댓값 사용(스프린트 임계는 avg_acc에 적용)
    df['Acceleration'] = acc.abs().fillna(0)
    
    # 8. 방향 계산
    df['X_diff'] = df['X'].diff()
    df['Y_diff'] = df['Y'].diff()

    df['Direction'] = calculate_direction(df['X_diff'], df['Y_diff'])
    df['Direction_smooth'] = df['Direction'].rolling(window=5, center=True).mean()
    df['Direction_change'] = df['Direction_smooth'].diff(3).apply(calculate_angle_change).abs() 
    
    results = {}
    
    # 9. 쿼터별 분석
    for i in quarter_info["quarters"]:
        print(f"[쿼터 분석] 쿼터={i['quarter']}, 상태={i['status']}, 시작={i['start_time']}, 종료={i['end_time']}")
        
        if i["status"] == "출전":
            # 출전 시간으로 자르기기
            quarter_data = df.loc[i["start_time"]:i["end_time"]]
            print(f"[쿼터 분석] {i['quarter']}: 추출된 데이터 건수 = {len(quarter_data)}")
            
            if len(quarter_data) == 0:
                print(f"[쿼터 분석] ⚠️ 경고: {i['quarter']} 데이터가 비어있습니다!")
                print(f"[쿼터 분석] DataFrame 인덱스 범위: {df.index.min()} ~ {df.index.max()}")
                print(f"[쿼터 분석] 쿼터 시간 타입: start={i['start_time'].__class__.__name__}, end={i['end_time'].__class__.__name__}")
    
            # 전체 지역 데이터
            total_data = quarter_data.copy()
            
            # new_short, new_long은 이미 1870-1882 라인에서 정의됨
            # ground_dict를 사용하거나 ground_data를 사용한 경우 모두 정의되어 있음
            
            # 경계선 계산 (중복 없이 모든 데이터가 포함되도록)
            mid_long = (new_long[0] + new_long[1]) / 2
            home_side = i.get("home") or "west"
            
            if home_side == "west":
                # 서쪽 팀: 공격은 동쪽 절반, 수비는 서쪽 절반
                attack_data = quarter_data[
                    (quarter_data["Y"] >= new_short[0]) &
                    (quarter_data["Y"] <= new_short[1]) &
                    (quarter_data["X"] > mid_long) &
                    (quarter_data["X"] <= new_long[1])
                ].copy()
                
                defense_data = quarter_data[
                    (quarter_data["Y"] >= new_short[0]) &
                    (quarter_data["Y"] <= new_short[1]) &
                    (quarter_data["X"] >= new_long[0]) &
                    (quarter_data["X"] <= mid_long)
                ].copy()
            else:
                # 동쪽 팀: 공격은 서쪽 절반, 수비는 동쪽 절반
                attack_data = quarter_data[
                    (quarter_data["Y"] >= new_short[0]) &
                    (quarter_data["Y"] <= new_short[1]) &
                    (quarter_data["X"] >= new_long[0]) &
                    (quarter_data["X"] < mid_long)
                ].copy()
                
                defense_data = quarter_data[
                    (quarter_data["Y"] >= new_short[0]) &
                    (quarter_data["Y"] <= new_short[1]) &
                    (quarter_data["X"] >= mid_long) &
                    (quarter_data["X"] <= new_long[1])
                ].copy()
            
            # 경계선에 있는 데이터 (X == mid_long)를 공격과 수비에 반반씩 분배
            boundary_data = quarter_data[
                (quarter_data["Y"] >= new_short[0]) &
                (quarter_data["Y"] <= new_short[1]) &
                (quarter_data["X"] == mid_long)
            ].copy()
            
            if not boundary_data.empty:
                # 경계선 데이터를 반반씩 분배
                half_size = len(boundary_data) // 2
                if home_side == "west":
                    # 서쪽 팀: 경계선 데이터의 앞쪽 절반을 수비에, 뒤쪽 절반을 공격에
                    defense_data = pd.concat([defense_data, boundary_data.iloc[:half_size]])
                    attack_data = pd.concat([attack_data, boundary_data.iloc[half_size:]])
                else:
                    # 동쪽 팀: 경계선 데이터의 앞쪽 절반을 공격에, 뒤쪽 절반을 수비에
                    attack_data = pd.concat([attack_data, boundary_data.iloc[:half_size]])
                    defense_data = pd.concat([defense_data, boundary_data.iloc[half_size:]])
                
            if raw_data_file:
                raw_full = _load_raw_df(raw_data_file, upload_file)
                raw_quarter = raw_full.loc[i["start_time"]:i["end_time"]]
                T_NOISE, T_RELIABILITY, T_QC = compute_data_quality(hz, raw_quarter, quarter_data)
            else:
                # Raw 파일이 없을 때 기본값 사용
                T_NOISE = 0.0
                T_RELIABILITY = 100
                T_QC = {"time_continuity": 0.0, "gps_accuracy": 0.0}

            # 전체 데이터 계산
            T_D, T_T, T_AS, T_HS, T_HS_T, T_AA, T_HA, T_HA_T, T_HTS, T_LTS, T_GS, T_DPM = first_cal(total_data)
            
            # 공격/수비 지역별 정확한 이동거리와 시간 계산
            A_D_corrected, D_D_corrected = calculate_region_distance(total_data, attack_data, defense_data, mid_long, home_side)
            A_T_corrected, D_T_corrected = calculate_region_time(total_data, mid_long, home_side)
            
            # 공격/수비 데이터의 다른 지표들 계산
            A_AS, A_HS, A_HS_T, A_AA, A_HA, A_HA_T, A_HTS, A_LTS, A_GS = first_cal(attack_data)[2:11]
            D_AS, D_HS, D_HS_T, D_AA, D_HA, D_HA_T, D_HTS, D_LTS, D_GS = first_cal(defense_data)[2:11]
            
            # 수정된 이동거리와 시간 사용
            A_D = A_D_corrected
            D_D = D_D_corrected
            A_T = A_T_corrected
            D_T = D_T_corrected
            
            # 수정된 분당 이동거리 계산
            A_DPM = ((A_D * 1000.0) / A_T) if A_T > 0 else 0.0
            D_DPM = ((D_D * 1000.0) / D_T) if D_T > 0 else 0.0
                
            T_Q1_AS, T_Q2_AS, T_Drop_AS = second_cal(total_data)
            A_Q1_AS, A_Q2_AS, A_Drop_AS = second_cal(attack_data)
            D_Q1_AS, D_Q2_AS, D_Drop_AS = second_cal(defense_data)
            
            T_AS_L = get_list(total_data, 100, "Speed")
            T_AA_L = get_list(total_data, 100, "Acceleration")
            A_AS_L = get_list(attack_data, 100, "Speed")
            A_AA_L = get_list(attack_data, 100, "Acceleration")
            D_AS_L = get_list(defense_data, 100, "Speed")
            D_AA_L = get_list(defense_data, 100, "Acceleration")

            # 전체 방향전환 계산
            T_LDT, T_HDT, T_LDT_L, T_HDT_L = direction_cal(total_data, new_short, new_long, type)
            
            # 공격/수비 지역별 정확한 방향전환 계산
            A_LDT_corrected, A_HDT_corrected, A_LDT_L_corrected, A_HDT_L_corrected, D_LDT_corrected, D_HDT_corrected, D_LDT_L_corrected, D_HDT_L_corrected = calculate_region_direction_changes(total_data, mid_long, new_short, new_long, type, home_side)
            
            
            # 수정된 방향전환 사용
            A_LDT = A_LDT_corrected
            A_HDT = A_HDT_corrected
            A_LDT_L = A_LDT_L_corrected
            A_HDT_L = A_HDT_L_corrected
            D_LDT = D_LDT_corrected
            D_HDT = D_HDT_corrected
            D_LDT_L = D_LDT_L_corrected
            D_HDT_L = D_HDT_L_corrected
            
            T_MR = calculate_activity_area(total_data, new_short, new_long, type)
            A_MR = calculate_activity_area(attack_data, new_short, new_long, type)
            D_MR = calculate_activity_area(defense_data, new_short, new_long, type)
            
            # 전체 스프린트 계산
            T_S, T_S_L, T_TSD, T_ASD, T_HSD, T_LSD, T_ASS, T_HSS, T_ASA, T_HSA = sprint_cal(total_data, new_short, new_long, type)
            
            # 공격/수비 지역별 정확한 스프린트 계산
            A_S_corrected, A_S_L_corrected, A_TSD_corrected, A_ASD_corrected, A_HSD_corrected, A_LSD_corrected, A_ASS_corrected, A_HSS_corrected, A_ASA_corrected, A_HSA_corrected, D_S_corrected, D_S_L_corrected, D_TSD_corrected, D_ASD_corrected, D_HSD_corrected, D_LSD_corrected, D_ASS_corrected, D_HSS_corrected, D_ASA_corrected, D_HSA_corrected = calculate_region_sprints(total_data, mid_long, new_short, new_long, type, home_side)
            
            # 수정된 스프린트 사용
            A_S = A_S_corrected
            A_S_L = A_S_L_corrected
            A_TSD = A_TSD_corrected
            A_ASD = A_ASD_corrected
            A_HSD = A_HSD_corrected
            A_LSD = A_LSD_corrected
            A_ASS = A_ASS_corrected
            A_HSS = A_HSS_corrected
            A_ASA = A_ASA_corrected
            A_HSA = A_HSA_corrected
            D_S = D_S_corrected
            D_S_L = D_S_L_corrected
            D_TSD = D_TSD_corrected
            D_ASD = D_ASD_corrected
            D_HSD = D_HSD_corrected
            D_LSD = D_LSD_corrected
            D_ASS = D_ASS_corrected
            D_HSS = D_HSS_corrected
            D_ASA = D_ASA_corrected
            D_HSA = D_HSA_corrected

            # 히트맵 데이터 (표시용 퍼센트맵) 제거

            # Canonical Truth Grid (1m) 레이어 저장용 (TOTAL만 유지)
            T_HMAP = build_grid_layers(total_data, new_short, new_long, "T", i["quarter"], resolution_m=1.0)
            # 히트맵 검증 show_heatmap(TI_H, new_short, new_long, cmap="hot")

            # 스프린트/방향전환 맵(SMAP, DMAP) 추가
            # 스프린트: 이벤트 시작 지점 좌표를 카운트 그리드로 변환
            # SMAP: 벡터 포함 맵(카운트+평균각도+평균 vmax)
            # 모든 스프린트 이벤트가 포함되도록 그리드 범위 클리핑 적용
            T_SMAP = _build_sprint_map(T_S_L, i["quarter"], "T")

            # 방향전환: 원본 이벤트 리스트 사용(LDT/HDT)
            T_DMAP = _build_direction_map(
                T_LDT_L, T_HDT_L, i["quarter"], "T"
            )

            # 3차 데이터 (비율 계산)
            T_SDPD = (T_TSD/(T_D*1000))*100 if T_D != 0 else 0
            A_TPT = (A_T/T_T)*100 if T_T != 0 else 0
            D_TPT = (D_T/T_T)*100 if T_T != 0 else 0
            
            # noise 항목 생성 (DB 표 변수명에 맞춤)
            noise_data = {
                "N_T": int(T_QC.get("time_continuity", 0.0)),  # 시간 노이즈
                "N_G": int(T_QC.get("gps_accuracy", 0.0)),     # GPS 노이즈
                "N_P": int(T_RELIABILITY)                       # 노이즈 점수
            }
            
            total_stats = {
                "T_D" : round(_apply_range_limits(T_D, 0, 100), 2), # 이동거리 (km)
                "T_T" : int(_apply_range_limits(T_T, 0, 500)), # 이동시간 (분)
                "T_DPM" : round(_apply_range_limits(T_DPM, 0, 500), 2), # 1분당 이동거리 (m)
                
                "T_AS" : round(_apply_range_limits(T_AS, 0, 50), 2), # 평균속력 (km/h)
                "T_HS" : round(_apply_range_limits(T_HS, 0, 50), 2), # 최고속력 (km/h)
                "T_HS_T": T_HS_T.to_pydatetime().isoformat() if T_HS_T is not None else None, # 최고속력 발생시각
                "T_Q1_AS": round(_apply_range_limits(T_Q1_AS, 0, 50), 2), # 전반 평균속력 (km/h)
                "T_Q2_AS": round(_apply_range_limits(T_Q2_AS, 0, 50), 2), # 후반 평균속력 (km/h)
                "T_Drop_AS": round(_apply_range_limits(T_Drop_AS, 0, 50), 2), # 전반 후반 속도 차이 (km/h)
                
                "T_HTS" : round(_apply_range_limits(T_HTS, 0, 50), 2), # 상위 10% 속력 (km/h)
                "T_LTS" : round(_apply_range_limits(T_LTS, 0, 50), 2), # 하위 10% 속력 (km/h)
                "T_GS" : round(_apply_range_limits(T_GS, 0, 50), 2), # 상위-하위 속력 차 (km/h)
                "T_AS_L" : _ensure_list_length([_apply_range_limits(x, 0, 50) for x in T_AS_L], 100), # 평균속력 100개 리스트
                
                "T_AA" : round(_apply_range_limits(T_AA, 0, 20), 4), # 평균 가속도 (m/s²)
                "T_HA" : round(_apply_range_limits(T_HA, 0, 20), 4), # 최고 가속도 (m/s²)
                "T_HA_T": T_HA_T.to_pydatetime().isoformat() if T_HA_T is not None else None, # 최고 가속도 시간
                "T_AA_L" : _ensure_list_length([_apply_range_limits(x, 0, 20) for x in T_AA_L], 100), # 평균 가속도 100개 리스트 (m/s²)
                
                "T_LDT" : int(_apply_range_limits(T_LDT, 0, 100)), # 90-150° 방향전환 횟수 (번)
                "T_LDT_L" : T_LDT_L if T_LDT_L and isinstance(T_LDT_L, list) else [], # 90-150° 방향전환 리스트
                "T_HDT" : int(_apply_range_limits(T_HDT, 0, 100)), # 150-180° 방향전환 횟수 (번)
                "T_HDT_L" : T_HDT_L if T_HDT_L and isinstance(T_HDT_L, list) else [], # 150-180° 방향전환 리스트
                
                "T_MR" : round(_apply_range_limits(T_MR, 0, 90), 2), # 활동 면적 (%)
                
                "T_S" : int(_apply_range_limits(T_S, 0, 100)), # 스프린트 횟수 (번)
                "T_S_L" : T_S_L if T_S_L and isinstance(T_S_L, list) else [], # 스프린트 리스트
                "T_TSD" : round(_apply_range_limits(T_TSD, 0, 1000), 2), # 스프린트 총 거리 (m)
                "T_ASD" : round(_apply_range_limits(T_ASD, 0, 50), 2), # 스프린트 평균 거리 (m)
                "T_HSD" : round(_apply_range_limits(T_HSD, 0, 50), 2), # 스프린트 최장 거리 (m)
                "T_LSD" : round(_apply_range_limits(T_LSD, 0, 50), 2), # 스프린트 최소 거리 (m)
                "T_SDPD" : round(_apply_range_limits(T_SDPD, 0, 100), 2), # 총 이동거리 당 스프린트 거리 비율 (%)
                "T_ASS" : round(_apply_range_limits(T_ASS, 0, 50), 2), # 스프린트 평균속력 (km/h)
                "T_HSS" : round(_apply_range_limits(T_HSS, 0, 50), 2), # 스프린트 최고속력 (km/h)
                "T_ASA" : round(_apply_range_limits(T_ASA, 0, 20), 2), # 스프린트 평균가속도 (m/s²)
                "T_HSA" : round(_apply_range_limits(T_HSA, 0, 20), 2), # 스프린트 최고가속도 (m/s²)
                
                "T_HMAP": T_HMAP, # 히트맵 리스트
                "T_SMAP": T_SMAP, # 스프린트 리스트
                "T_DMAP": T_DMAP, # 방향전환 리스트
                
                "AN_T": type, # 사용자 레벨 (pro/amateur/youth)
            }
            
            attack_stats = {
                "A_D" : round(_apply_range_limits(A_D, 0, 100), 2), # 이동거리 (km)
                "A_T" : int(_apply_range_limits(A_T, 0, 500)), # 이동시간 (분)
                "A_DPM" : round(_apply_range_limits(A_DPM, 0, 500), 2), # 1분당 이동거리 (m)
                "A_TPT" : round(_apply_range_limits(A_TPT, 0, 100), 2), # 해당 시간 비율 (%)
                
                "A_AS" : round(_apply_range_limits(A_AS, 0, 50), 2), # 평균속력 (km/h)
                "A_HS" : round(_apply_range_limits(A_HS, 0, 50), 2), # 최고속력 (km/h)
                "A_HS_T": A_HS_T.to_pydatetime().isoformat() if A_HS_T is not None else None, # 최고속력 발생시각
                "A_Q1_AS": round(_apply_range_limits(A_Q1_AS, 0, 50), 2), # 전반 평균속력 (km/h)
                "A_Q2_AS": round(_apply_range_limits(A_Q2_AS, 0, 50), 2), # 후반 평균속력 (km/h)
                "A_Drop_AS": round(_apply_range_limits(A_Drop_AS, 0, 50), 2), # 전반 후반 속도 차이 (km/h)
                
                "A_HTS" : round(_apply_range_limits(A_HTS, 0, 50), 2), # 상위 10% 속력 (km/h)
                "A_LTS" : round(_apply_range_limits(A_LTS, 0, 50), 2), # 하위 10% 속력 (km/h)
                "A_GS" : round(_apply_range_limits(A_GS, 0, 50), 2), # 상위-하위 속력 차 (km/h)
                
                "A_AA" : round(_apply_range_limits(A_AA, 0, 20), 4), # 평균 가속도 (m/s²)
                "A_HA" : round(_apply_range_limits(A_HA, 0, 20), 4), # 최고 가속도 (m/s²)
                "A_HA_T": A_HA_T.to_pydatetime().isoformat() if A_HA_T is not None else None, # 최고 가속도 시간
                "A_AS_L" : _ensure_list_length([_apply_range_limits(x, 0, 50) for x in A_AS_L], 100), # 평균속력 100개 리스트
                "A_AA_L" : _ensure_list_length([_apply_range_limits(x, 0, 20) for x in A_AA_L], 100), # 평균 가속도 100개 리스트 (m/s²)
                "A_LDT" : int(_apply_range_limits(A_LDT, 0, 100)), # 90-150° 방향전환 횟수 (번)
                "A_LDT_L" : A_LDT_L if A_LDT_L and isinstance(A_LDT_L, list) else [], # 90-150° 방향전환 리스트
                "A_HDT" : int(_apply_range_limits(A_HDT, 0, 100)), # 150-180° 방향전환 횟수 (번)
                "A_HDT_L" : A_HDT_L if A_HDT_L and isinstance(A_HDT_L, list) else [], # 150-180° 방향전환 리스트
                
                "A_MR" : round(_apply_range_limits(A_MR, 0, 90), 2), # 활동 면적 (%)
                "A_S" : int(_apply_range_limits(A_S, 0, 100)), # 스프린트 횟수 (번)
                "A_S_L" : A_S_L if A_S_L and isinstance(A_S_L, list) else [], # 스프린트 리스트
                "A_TSD" : round(_apply_range_limits(A_TSD, 0, 1000), 2), # 스프린트 총 거리 (m)
                "A_ASD" : round(_apply_range_limits(A_ASD, 0, 50), 2), # 스프린트 평균 거리 (m)
                "A_HSD" : round(_apply_range_limits(A_HSD, 0, 50), 2), # 스프린트 최장 거리 (m)
                "A_LSD" : round(_apply_range_limits(A_LSD, 0, 50), 2), # 스프린트 최소 거리 (m)
                "A_SDPD" : round(_apply_range_limits(0, 0, 100), 2), # 총 이동거리 당 스프린트 거리 비율 (%) - 추후 계산 필요
                "A_ASS" : round(_apply_range_limits(A_ASS, 0, 50), 2), # 스프린트 평균속력 (km/h)
                "A_HSS" : round(_apply_range_limits(A_HSS, 0, 50), 2), # 스프린트 최고속력 (km/h)
                "A_ASA" : round(_apply_range_limits(A_ASA, 0, 20), 2), # 스프린트 평균가속도 (m/s²)
                "A_HSA" : round(_apply_range_limits(A_HSA, 0, 20), 2), # 스프린트 최고가속도 (m/s²)
            }
            
            defense_stats = {
                "D_D" : round(_apply_range_limits(D_D, 0, 100), 2), # 이동거리 (km)
                "D_T" : int(_apply_range_limits(D_T, 0, 500)), # 이동시간 (분)
                "D_DPM" : round(_apply_range_limits(D_DPM, 0, 500), 2), # 1분당 이동거리 (m)
                "D_TPT" : round(_apply_range_limits(D_TPT, 0, 100), 2), # 해당 시간 비율 (%)
                
                "D_AS" : round(_apply_range_limits(D_AS, 0, 50), 2), # 평균속력 (km/h)
                "D_HS" : round(_apply_range_limits(D_HS, 0, 50), 2), # 최고속력 (km/h)
                "D_HS_T": D_HS_T.to_pydatetime().isoformat() if D_HS_T is not None else None, # 최고속력 발생시각
                "D_Q1_AS": round(_apply_range_limits(D_Q1_AS, 0, 50), 2), # 전반 평균속력 (km/h)
                "D_Q2_AS": round(_apply_range_limits(D_Q2_AS, 0, 50), 2), # 후반 평균속력 (km/h)
                "D_Drop_AS": round(_apply_range_limits(D_Drop_AS, 0, 50), 2), # 전반 후반 속도 차이 (km/h)
                
                "D_HTS" : round(_apply_range_limits(D_HTS, 0, 50), 2), # 상위 10% 속력 (km/h)
                "D_LTS" : round(_apply_range_limits(D_LTS, 0, 50), 2), # 하위 10% 속력 (km/h)
                "D_GS" : round(_apply_range_limits(D_GS, 0, 50), 2), # 상위-하위 속력 차 (km/h)
                
                "D_AA" : round(_apply_range_limits(D_AA, 0, 20), 4), # 평균 가속도 (m/s²)
                "D_HA" : round(_apply_range_limits(D_HA, 0, 20), 4), # 최고 가속도 (m/s²)
                "D_HA_T": D_HA_T.to_pydatetime().isoformat() if D_HA_T is not None else None, # 최고 가속도 시간
                "D_AS_L" : _ensure_list_length([_apply_range_limits(x, 0, 50) for x in D_AS_L], 100), # 평균속력 100개 리스트
                "D_AA_L" : _ensure_list_length([_apply_range_limits(x, 0, 20) for x in D_AA_L], 100), # 평균 가속도 100개 리스트 (m/s²)
                "D_LDT" : int(_apply_range_limits(D_LDT, 0, 100)), # 90-150° 방향전환 횟수 (번)
                "D_LDT_L" : D_LDT_L if D_LDT_L and isinstance(D_LDT_L, list) else [], # 90-150° 방향전환 리스트
                "D_HDT" : int(_apply_range_limits(D_HDT, 0, 100)), # 150-180° 방향전환 횟수 (번)
                "D_HDT_L" : D_HDT_L if D_HDT_L and isinstance(D_HDT_L, list) else [], # 150-180° 방향전환 리스트
                
                "D_MR" : round(_apply_range_limits(D_MR, 0, 90), 2), # 활동 면적 (%)
                "D_S" : int(_apply_range_limits(D_S, 0, 100)), # 스프린트 횟수 (번)
                "D_S_L" : D_S_L if D_S_L and isinstance(D_S_L, list) else [], # 스프린트 리스트
                "D_TSD" : round(_apply_range_limits(D_TSD, 0, 1000), 2), # 스프린트 총 거리 (m)
                "D_ASD" : round(_apply_range_limits(D_ASD, 0, 50), 2), # 스프린트 평균 거리 (m)
                "D_HSD" : round(_apply_range_limits(D_HSD, 0, 50), 2), # 스프린트 최장 거리 (m)
                "D_LSD" : round(_apply_range_limits(D_LSD, 0, 50), 2), # 스프린트 최소 거리 (m)
                "D_SDPD" : round(_apply_range_limits(0, 0, 100), 2), # 총 이동거리 당 스프린트 거리 비율 (%) - 추후 계산 필요
                "D_ASS" : round(_apply_range_limits(D_ASS, 0, 50), 2), # 스프린트 평균속력 (km/h)
                "D_HSS" : round(_apply_range_limits(D_HSS, 0, 50), 2), # 스프린트 최고속력 (km/h)
                "D_ASA" : round(_apply_range_limits(D_ASA, 0, 20), 2), # 스프린트 평균가속도 (m/s²)
                "D_HSA" : round(_apply_range_limits(D_HSA, 0, 20), 2), # 스프린트 최고가속도 (m/s²)
            }           

            attack_point = cal_point(attack_stats, "A", type)
            defense_point = cal_point(defense_stats, "D", type)
            stamina_point = cal_stamina_point(total_stats, type) # 스테미나 포인트
            positiveness_point = cal_positiveness_point(total_stats, type) # 적극성 포인트
            speed_point = cal_speed_point(total_stats, type) # 속도 포인트
            acceleration_point = cal_acceleration_point(total_stats, type) # 가속도 포인트
            sprint_point = cal_sprint_point(total_stats, type) # 스프린트 포인트
            
            total_point = attack_point*(0.05) + defense_point*(0.05) + stamina_point*(0.20) + \
                           positiveness_point*(0.15) + speed_point*(0.15) + acceleration_point*(0.10) + \
                           sprint_point*(0.30)
            total_point = max(0, min(100, total_point))
            
            point={"point_total" : int(total_point),
                    "point_attack" : int(attack_point),
                    "point_defense" : int(defense_point),
                    "point_stamina" : int(stamina_point),
                    "point_positiveness" : int(positiveness_point),
                    "point_speed" : int(speed_point),
                    "point_acceleration" : int(acceleration_point),
                    "point_sprint" : int(sprint_point),
                    }

            # 플랫 구조로 결과 통합 (팀 분석과 동일한 방식)
            flat_result = {}
            
            # Total 데이터를 T_ 접두사로 추가
            for key, value in total_stats.items():
                flat_result[key] = value
            
            # Attack 데이터 추가 (이미 A_ 접두사를 가지고 있음)
            for key, value in attack_stats.items():
                flat_result[key] = value
            
            # Defense 데이터 추가 (이미 D_ 접두사를 가지고 있음)
            for key, value in defense_stats.items():
                flat_result[key] = value
            
            # Noise 데이터를 N_ 접두사로 추가 (DECIMAL 형태로)
            flat_result["N_T"] = round(_apply_range_limits(float(noise_data.get("N_T", 0)), 0, 100), 2)
            flat_result["N_G"] = round(_apply_range_limits(float(noise_data.get("N_G", 0)), 0, 100), 2)
            flat_result["N_P"] = round(_apply_range_limits(float(noise_data.get("N_P", 0)), 0, 100), 2)
            
            # 분석 타입 추가 (N_P 아래에 위치)
            flat_result["AN_T"] = type
            
            # Point 데이터 추가
            for key, value in point.items():
                flat_result[key] = value
            
            results[i["quarter"]] = flat_result
            
        else:
            # 출전하지 않은 쿼터의 플랫 구조 (기본값들)
            results[i["quarter"]] = {
                # 기본 Total 지표들
                "T_D": 0.0, "T_T": 0.0, "T_AS": 0.0, "T_HS": 0.0, "T_HS_T": None,
                "T_Q1_AS": 0.0, "T_Q2_AS": 0.0, "T_Drop_AS": 0.0,
                "T_HTS": 0.0, "T_LTS": 0.0, "T_GS": 0.0, "T_AS_L": [],
                "T_AA": 0.0, "T_HA": 0.0, "T_HA_T": None, "T_AA_L": [],
                
                # Attack 지표들
                "A_D": 0.0, "A_T": 0.0, "A_AS": 0.0, "A_HS": 0.0, "A_HS_T": None,
                "A_Q1_AS": 0.0, "A_Q2_AS": 0.0, "A_Drop_AS": 0.0,
                "A_HTS": 0.0, "A_LTS": 0.0, "A_GS": 0.0, "A_AS_L": [],
                "A_AA": 0.0, "A_HA": 0.0, "A_HA_T": None, "A_AA_L": [],
                
                # Defense 지표들
                "D_D": 0.0, "D_T": 0.0, "D_AS": 0.0, "D_HS": 0.0, "D_HS_T": None,
                "D_Q1_AS": 0.0, "D_Q2_AS": 0.0, "D_Drop_AS": 0.0,
                "D_HTS": 0.0, "D_LTS": 0.0, "D_GS": 0.0, "D_AS_L": [],
                "D_AA": 0.0, "D_HA": 0.0, "D_HA_T": None, "D_AA_L": [],
                
                # 점수 관련
                "point_total": 0, "point_attack": 0, "point_defense": 0,
                "point_stamina": 0, "point_positiveness": 0, "point_speed": 0,
                "point_acceleration": 0, "point_sprint": 0,
                
                # 노이즈 관련 (DECIMAL 형태)
                "N_T": 0.0, "N_G": 0.0, "N_P": 0.0,
                
                # 분석 타입 (N_P 아래에 위치)
                "AN_T": type
            }
    
    return results


def _apply_range_limits(value: float, min_val: float, max_val: float) -> float:
    """값을 허용 범위 내로 제한"""
    return max(min_val, min(max_val, value))

def _latlon_to_meters(latitude: float, longitude: float):
    if utm is None:
        raise RuntimeError("utm 모듈 설치 필요: pip install utm")
    easting, northing, _, _ = utm.from_latlon(latitude, longitude)
    return float(easting), float(northing)

def _load_raw_df(raw_path: str, edit_path: str = None) -> pd.DataFrame:
    """
    Raw GPS CSV 파일을 DataFrame으로 변환
    
    Args:
        raw_path (str): Raw GPS CSV 파일 경로
        edit_path (str, optional): Edit CSV 파일 경로 (날짜 추출용)
    
    Returns:
        pd.DataFrame: DateTime, X(m), Y(m), Speed, Acceleration 컬럼을 가진 DataFrame
    
    Note:
        - CSV 파일에서 device_id, time, latitude, longitude 컬럼 읽기
        - 파일명에서 YYMMDD를 추출하거나 Edit CSV에서 날짜 가져오기
        - 시간 롤오버(자정 넘김) 처리
        - 위경도를 UTM 좌표로 변환
        - 속도/가속도는 per-sample 기반 계산
    """
    # CSV 파일 읽기
    df_raw = pd.read_csv(raw_path)
    
    base = os.path.basename(raw_path)
    
    # 새로운 파일명 형식 (p_001.csv) 처리
    if base.startswith('p_'):
        # CSV 파일에서 첫 번째 데이터의 시간을 기준으로 날짜 추정
        df_sample = pd.read_csv(raw_path, nrows=1)
        if not df_sample.empty:
            first_time = df_sample.iloc[0]['time']  # HH:MM:SS 형식
            # 기본 날짜를 오늘로 설정 (실제로는 파일 생성일 등을 참고할 수 있음)
            current_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        else:
            current_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        # 기존 파일명 형식 (003_2506220645_10.csv) 처리
        m = re.search(r"\d{3}_(\d{10})", base)
        if m:
            stamp = m.group(1)  # YYMMDDHHMM
            meas_date = f"20{stamp[0:2]}.{stamp[2:4]}.{stamp[4:6]}"
            current_date = datetime.strptime(meas_date, '%Y.%m.%d')
        elif edit_path:
            # 파일명에서 날짜를 추출할 수 없으면 Edit CSV에서 추출
            try:
                df_edit = pd.read_csv(edit_path, nrows=1)
                if not df_edit.empty and 'datetime' in df_edit.columns:
                    # datetime 컬럼이 있으면 첫 행의 날짜 사용
                    datetime_str = str(df_edit.iloc[0]['datetime'])
                    # 포맷: "2025.06.22.06.47.40.000" -> "2025-06-22 06:47:40"
                    if '.' in datetime_str:
                        parts = datetime_str.split('.')
                        if len(parts) >= 6:
                            date_str = f"{parts[0]}-{parts[1]}-{parts[2]} {parts[3]}:{parts[4]}:{parts[5]}"
                            first_datetime = pd.to_datetime(date_str, format='%Y-%m-%d %H:%M:%S')
                            current_date = first_datetime.replace(hour=0, minute=0, second=0, microsecond=0)
                        else:
                            current_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                    else:
                        first_datetime = pd.to_datetime(datetime_str)
                        current_date = first_datetime.replace(hour=0, minute=0, second=0, microsecond=0)
                else:
                    # datetime 컬럼이 없으면 현재 날짜 사용
                    current_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            except Exception as e:
                print(f"Edit CSV에서 날짜 추출 실패: {e}, 현재 날짜 사용")
                current_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        else:
            # Edit 파일도 없으면 현재 날짜 사용
            print("파일명에서 날짜를 추출할 수 없고 Edit 파일도 없음, 현재 날짜 사용")
            current_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    records: list[tuple[datetime, float, float]] = []
    prev_hhmm: int | None = None
    
    for _, row in df_raw.iterrows():
        time_field = row['time'].replace(':', '')  # HH:MM:SS -> HHMMSS
        if len(time_field) != 6 or not time_field.isdigit():
            continue
        try:
            lat = float(row['latitude'])
            lon = float(row['longitude'])
        except ValueError:
            continue
        hh = int(time_field[0:2])
        mm = int(time_field[2:4])
        ss = int(time_field[4:6])
        hhmm = hh * 100 + mm
        if prev_hhmm is not None and hhmm < prev_hhmm:
            current_date += timedelta(days=1)
        prev_hhmm = hhmm
        dt = datetime(
            year=current_date.year,
            month=current_date.month,
            day=current_date.day,
            hour=hh,
            minute=mm,
            second=ss,
            microsecond=0,
        )
        # 위경도를 UTM 좌표로 변환
        try:
            x_utm, y_utm = _latlon_to_meters(lat, lon)
            records.append((dt, x_utm, y_utm))
        except Exception:
            continue  # 변환 실패 시 해당 레코드 스킵

    if not records:
        return pd.DataFrame(columns=["X", "Y", "Speed_raw", "Speed", "Acceleration"])

    df = pd.DataFrame(records, columns=["DateTime", "X", "Y"]).sort_values("DateTime")
    df = df.groupby("DateTime", as_index=False).mean(numeric_only=True)
    df.set_index("DateTime", inplace=True)

    # per-sample 속도/가속도 계산
    dt_s = df.index.to_series().diff().dt.total_seconds()
    dx = df['X'].diff()
    dy = df['Y'].diff()
    with np.errstate(divide='ignore', invalid='ignore'):
        speed_raw = np.where((dt_s > 0) & np.isfinite(dt_s), (np.sqrt(dx**2 + dy**2) / dt_s) * 3.6, np.nan)
    df['Speed_raw'] = pd.Series(speed_raw, index=df.index)
    df['Speed'] = df['Speed_raw'].rolling(window=5, center=True).mean()
    df['Speed'] = df['Speed'].clip(lower=0, upper=40)
    with np.errstate(divide='ignore', invalid='ignore'):
        acc = (df['Speed'].diff() / dt_s) * (1 / 3.6)
    df['Acceleration'] = acc.abs().fillna(0)
    return df

def _is_attack_side(x_value, mid_long, attack_on_right):
    """Return True if the X coordinate belongs to the attacking half."""
    if attack_on_right:
        return x_value > mid_long
    return x_value < mid_long