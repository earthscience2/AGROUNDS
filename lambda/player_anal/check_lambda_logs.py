#!/usr/bin/env python3
"""Lambda CloudWatch 로그 확인"""

import boto3
import os
from datetime import datetime, timedelta

# .env 파일에서 AWS credentials 읽기
env_file = '/home/ubuntu/agrounds/mysite/backend/.env'
aws_credentials = {}

if os.path.exists(env_file):
    with open(env_file, 'r') as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    aws_credentials[key] = value

# CloudWatch Logs 클라이언트 생성
logs_client = boto3.client(
    'logs',
    aws_access_key_id=aws_credentials.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=aws_credentials.get('AWS_SECRET_ACCESS_KEY'),
    region_name='ap-northeast-2'
)

# Lambda 함수의 로그 그룹
log_group_name = '/aws/lambda/Agrounds_player_anal'

print("=" * 60)
print("Lambda 함수 CloudWatch 로그 확인")
print("=" * 60)
print(f"로그 그룹: {log_group_name}")

try:
    # 최근 5분간의 로그 스트림 가져오기
    response = logs_client.describe_log_streams(
        logGroupName=log_group_name,
        orderBy='LastEventTime',
        descending=True,
        limit=3
    )
    
    if not response.get('logStreams'):
        print("\n⚠️ 최근 로그 스트림이 없습니다.")
        print("Lambda 함수가 아직 실행되지 않았을 수 있습니다.")
    else:
        print(f"\n✅ 최근 로그 스트림 {len(response['logStreams'])}개 발견")
        
        # 각 로그 스트림의 최근 로그 이벤트 가져오기
        for stream in response['logStreams']:
            stream_name = stream['logStreamName']
            print(f"\n{'='*60}")
            print(f"로그 스트림: {stream_name}")
            print(f"마지막 이벤트: {datetime.fromtimestamp(stream['lastEventTimestamp']/1000)}")
            print(f"{'='*60}")
            
            # 로그 이벤트 가져오기
            events_response = logs_client.get_log_events(
                logGroupName=log_group_name,
                logStreamName=stream_name,
                limit=50,
                startFromHead=False
            )
            
            events = events_response.get('events', [])
            if events:
                print(f"\n최근 로그 이벤트 {len(events)}개:\n")
                for event in reversed(events[-30:]):  # 최근 30개만
                    timestamp = datetime.fromtimestamp(event['timestamp']/1000)
                    message = event['message'].rstrip()
                    print(f"[{timestamp.strftime('%H:%M:%S')}] {message}")
            else:
                print("이벤트가 없습니다.")

except Exception as e:
    print(f"\n❌ 로그 확인 중 오류 발생: {str(e)}")
    
    if 'ResourceNotFoundException' in str(e):
        print(f"\n로그 그룹을 찾을 수 없습니다: {log_group_name}")
        print("Lambda 함수가 한 번도 실행되지 않았거나, 로그 그룹 이름이 잘못되었을 수 있습니다.")

print("\n" + "=" * 60)

