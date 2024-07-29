import json
import matplotlib.pyplot as plt

class gps_normalizetion:
    def __init__(self, json_file):
        self.data = json_file

        self.player_list = []
        for i in range(0,len(self.data['player']),1):
            self.player_list.append(self.data['player'][i]['player_name'])
        
        extend_short = self.data['extend_short']
        extend_long = self.data['extend_long']

        width = abs(extend_short[0] - extend_short[1])
        height = abs(extend_long[0] - extend_long[1])

        # 축구장 이미지 크기
        img_width = 340
        img_height = 180 

        self.Benchmark = [extend_short[0], extend_long[0]]

        self.ratio_width = img_width/width
        self.ratio_height = img_height/height

    def normalize_position(self, player_number):
        gps_data_1 = self.data['player'][player_number]['edit_data']

        coordinates = []

        for point in gps_data_1 :
            point = point.split('/')[2:4]
            gps = [float(point[0]), float(point[1])]
            coordinates.append([(gps[0] - self.Benchmark[0]) * self.ratio_width, (gps[1] - self.Benchmark[1]) * self.ratio_height])

        return coordinates
