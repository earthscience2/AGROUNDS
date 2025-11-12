#!/usr/bin/env python3
"""Lambda 함수 업데이트 스크립트"""

import boto3
import os
import zipfile
import subprocess
import shutil
from pathlib import Path

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

# Lambda 클라이언트 생성
lambda_client = boto3.client(
    'lambda',
    aws_access_key_id=aws_credentials.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=aws_credentials.get('AWS_SECRET_ACCESS_KEY'),
    region_name='ap-northeast-2'
)

function_name = 'Agrounds_player_anal'
lambda_dir = '/home/ubuntu/agrounds/mysite/lambda/player_anal'
zip_file_path = f'{lambda_dir}/lambda_function.zip'

print("=" * 60)
print("Lambda 함수 업데이트 (Layer 방식)")
print("=" * 60)

# 1. ZIP 파일 생성 (코드만, 라이브러리는 Layer)
print("\n📦 ZIP 파일 생성 중 (코드만)...")

# 기존 ZIP 파일 삭제
if os.path.exists(zip_file_path):
    os.remove(zip_file_path)

# ZIP 파일 생성
with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # main.py 추가
    print("  - main.py 추가")
    zipf.write(f'{lambda_dir}/main.py', 'main.py')
    
    # anal_cal.py 추가
    print("  - anal_cal.py 추가")
    zipf.write(f'{lambda_dir}/anal_cal.py', 'anal_cal.py')
    
    # 선수 GPT 분석 관련 파일 추가
    print("  - summarize.py 추가")
    zipf.write(f'{lambda_dir}/summarize.py', 'summarize.py')
    
    print("  - gpt.py 추가")
    zipf.write(f'{lambda_dir}/gpt.py', 'gpt.py')
    
    print("  ℹ️ OpenAI 라이브러리는 Lambda Layer에서 제공됨")

file_size = os.path.getsize(zip_file_path) / (1024 * 1024)
print(f"\n✅ ZIP 파일 생성 완료 ({file_size:.2f} MB)")

# ZIP 파일 크기 체크 (Lambda 제한: 50MB)
if file_size > 50:
    print(f"\n⚠️ 경고: ZIP 파일이 50MB를 초과했습니다 ({file_size:.2f} MB)")
    print("  Lambda Layer 사용을 권장합니다.")
    exit(1)

# 2. Lambda 함수 업데이트
print(f"\n📤 Lambda 함수 업데이트 중: {function_name}")

try:
    with open(zip_file_path, 'rb') as f:
        zip_data = f.read()
    
    response = lambda_client.update_function_code(
        FunctionName=function_name,
        ZipFile=zip_data
    )
    
    print(f"\n✅ Lambda 함수 업데이트 완료!")
    print(f"\n📋 업데이트 정보:")
    print(f"  Function Name: {response['FunctionName']}")
    print(f"  Function ARN: {response['FunctionArn']}")
    print(f"  Runtime: {response['Runtime']}")
    print(f"  Handler: {response['Handler']}")
    print(f"  Last Modified: {response['LastModified']}")
    print(f"  Code Size: {response['CodeSize'] / 1024:.2f} KB")
    
    print(f"\n🔧 변경 사항:")
    print(f"  - 선수 GPT 분석 기능 (summarize, gpt)")
    print(f"  - PlayerAi 테이블 저장 로직")
    print(f"  - Lambda 함수 안정성 개선")

except Exception as e:
    print(f"\n❌ Lambda 함수 업데이트 실패: {str(e)}")
    if 'AccessDenied' in str(e):
        print("\nIAM 권한이 필요합니다:")
        print("  - lambda:UpdateFunctionCode")
    exit(1)

finally:
    # 배포 후 정리 (필요시)
    pass

print("\n" + "=" * 60)
print("\n⚠️ 추가 설정 필요 사항:")
print("\n1. Lambda 환경변수 설정:")
print("   AWS Console → Lambda → Configuration → Environment variables")
print("   - GPT_API_KEY=sk-your-openai-api-key")
print("\n2. Lambda 타임아웃 증가:")
print("   AWS Console → Lambda → Configuration → General configuration")
print("   - Timeout: 300초 (5분) 권장")
print("\n3. Lambda 메모리 증가 (선택):")
print("   - Memory: 512MB → 1024MB (GPT 처리 속도 향상)")
print("\n" + "=" * 60)

