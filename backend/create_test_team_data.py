#!/usr/bin/env python3
"""
V3 팀 테스트 데이터 생성 스크립트
"""
import os
import sys
import django

# Django 설정
sys.path.append('/home/ubuntu/agrounds/mysite/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agrounds.settings.local')
django.setup()

from DB.models import V3_Team_Info, V3_Player_Team_Cross
from django.utils import timezone

def create_test_teams():
    """테스트 팀 데이터 생성"""
    
    # 기존 테스트 팀 삭제 (중복 방지)
    test_team_codes = ['t_test001', 't_test002', 't_test003', 't_test004', 't_test005']
    V3_Team_Info.objects.filter(team_code__in=test_team_codes).delete()
    V3_Player_Team_Cross.objects.filter(team_code__in=test_team_codes).delete()
    
    # 테스트 팀 데이터
    test_teams = [
        {
            'team_code': 't_test001',
            'host': 'u_host001',
            'name': 'FC Agrounds',
            'local': '성남시'
        },
        {
            'team_code': 't_test002',
            'host': 'u_host002',
            'name': 'FC 바이에른뮌헨',
            'local': '서울시'
        },
        {
            'team_code': 't_test003',
            'host': 'u_host003',
            'name': '파리생제르망',
            'local': '부천시'
        },
        {
            'team_code': 't_test004',
            'host': 'u_host004',
            'name': '울산현대',
            'local': '울산시'
        },
        {
            'team_code': 't_test005',
            'host': 'u_host005',
            'name': '에이그라운즈',
            'local': '인천시'
        }
    ]
    
    # 팀 생성
    for team_data in test_teams:
        team = V3_Team_Info.objects.create(**team_data)
        print(f"✅ 팀 생성: {team.name} ({team.team_code})")
        
        # 각 팀에 랜덤한 수의 멤버 추가 (팀장 포함)
        import random
        member_count = random.randint(15, 50)
        
        # 팀장 추가
        V3_Player_Team_Cross.objects.create(
            team_code=team.team_code,
            user_code=team.host,
            role='host'
        )
        
        # 일반 멤버 추가
        for i in range(member_count - 1):
            V3_Player_Team_Cross.objects.create(
                team_code=team.team_code,
                user_code=f'u_member_{team.team_code}_{i:03d}',
                role='player'
            )
        
        print(f"   멤버 {member_count}명 추가")
    
    print(f"\n🎉 총 {len(test_teams)}개 팀과 멤버 데이터 생성 완료!")

if __name__ == '__main__':
    create_test_teams()
