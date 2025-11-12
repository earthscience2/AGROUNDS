# Lambda 선수 분석 시스템 - 완전 가이드

## 📋 목차
1. [개요](#개요)
2. [배포 방법](#배포-방법)
3. [설정 가이드](#설정-가이드)
4. [상태 관리](#상태-관리)
5. [모니터링](#모니터링)
6. [문제 해결](#문제-해결)

---

## 📊 개요

### 시스템 구조
```
프론트엔드 → Django API → Lambda → Django API → DB
                ↓                      ↓
           PlayerMatch           PlayerAnal
                                 PlayerAi
```

### 처리 플로우
```
1. GPS 분석 (30-60초)
   - S3에서 GPS 데이터 다운로드
   - anal_cal.player_anal() 실행
   - 4개 쿼터별 분석
   - PlayerAnal 테이블 저장

2. AI 요약 (20-40초)
   - 쿼터별 데이터 요약 (summarize.py)
   - GPT-5 API 호출 (gpt.py)
   - 핵심 포인트 5개 추출
   - PlayerAi 테이블 저장

총 소요 시간: 1-2분
```

---

## 🚀 배포 방법

### 1단계: OpenAI Layer 생성 (최초 1회만)

```bash
cd /home/ubuntu/agrounds/mysite/lambda/player_anal
python3 create_openai_layer.py
```

생성된 `openai_layer.zip`을 AWS Lambda Layer로 등록:
```bash
aws lambda publish-layer-version \
  --layer-name agrounds-openai \
  --description 'OpenAI and tiktoken for player analysis' \
  --zip-file fileb://openai_layer.zip \
  --compatible-runtimes python3.12 \
  --compatible-architectures x86_64 \
  --region ap-northeast-2
```

### 2단계: Lambda 함수 배포

```bash
cd /home/ubuntu/agrounds/mysite/lambda/player_anal
python3 deploy_lambda.py
```

자동으로:
- ✅ main.py, anal_cal.py, summarize.py, gpt.py 패키징
- ✅ ZIP 파일 생성
- ✅ Lambda 함수 업데이트

---

## ⚙️ 설정 가이드

### Lambda 환경변수 (필수)

AWS Console → Lambda → Configuration → Environment variables

```
GPT_API_KEY=sk-proj-your-openai-api-key
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
S3_BUCKET_NAME=your-s3-bucket
DJANGO_API_URL=https://agrounds.com
```

### Lambda 설정 (권장)

```
Timeout: 300초 (5분)
Memory: 1024 MB
Runtime: Python 3.12
Handler: main.lambda_handler
```

### Layer 연결

AWS Console → Lambda → Configuration → Layers → Add a layer
- Custom layers → `agrounds-openai` → 최신 버전 선택

---

## 📊 상태 관리 (6단계)

### 상태 플로우

```
분석 시작
  ↓
① anal (GPS 분석 중)
  ↓
② anal_done (GPS 완료)
  ↓
③ ai (AI 요약 중)
  ↓
④ ai_done (전체 완료) ✅

[실패 케이스]
⑤ anal_fail (GPS 실패) ❌
⑥ ai_fail (AI 실패) ⚠️
```

### 상태값 정의

| 상태 | 의미 | 설정 시점 | 다음 상태 |
|------|------|-----------|----------|
| `anal` | GPS 분석 시작 | 프론트엔드 요청 | anal_done / anal_fail |
| `anal_done` | GPS 분석 완료 | 모든 쿼터 저장 완료 | ai |
| `ai` | AI 요약 시작 | GPT 처리 시작 | ai_done / ai_fail |
| `ai_done` | AI 요약 완료 (최종) | PlayerAi 저장 완료 | - |
| `anal_fail` | GPS 분석 실패 | Lambda 에러 | - |
| `ai_fail` | AI 요약 실패 | GPT 처리 실패 | - |

### 상태 업데이트 위치

```python
# 1. anal (시작)
backend/anal/views.py:682
PlayerMatch.objects.create(status='anal')

# 2. anal_done (GPS 완료)
backend/anal/views.py:1047
player_match.status = 'anal_done'

# 3. ai (AI 시작)
lambda/main.py:458
status='ai'

# 4. ai_done (최종 완료)
lambda/main.py:636
status='ai_done'

# 5. anal_fail (GPS 실패)
lambda/main.py:287, 397
status='anal_fail'

# 6. ai_fail (AI 실패)
lambda/main.py:659, 689
status='ai_fail'
```

---

## 🔍 모니터링

### CloudWatch Logs 확인

```bash
cd /home/ubuntu/agrounds/mysite/lambda/player_anal
python3 check_lambda_logs.py
```

또는:
```bash
aws logs tail /aws/lambda/Agrounds_player_anal --follow
```

### 주요 로그 메시지

**GPS 분석 단계:**
```
[Lambda] anal_cal 모듈 import 성공
[Lambda] anal_cal.player_anal() 실행 시작
[Lambda] anal_cal.player_anal() 성공, 전체 지표 계산 완료
모든 쿼터 Django API로 전송 완료
```

**AI 요약 단계:**
```
📊 GPT 핵심 포인트 추출 시작
✓ Match status 'ai' 업데이트
✓ 전체 쿼터 요약 완료 (길이: xxxx 자)
✓ GPT 요청 준비 완료
✓ GPT 응답 수신 완료
✅ PlayerAi 저장 완료
✅ Match status 'ai_done' 업데이트 완료
```

---

## ⚠️ 문제 해결

### 1. GPT API 키 오류

**증상:**
```
FileNotFoundError: [Errno 2] No such file or directory: 'GPT_API_KEY.json'
```

**해결:**
Lambda 환경변수에 `GPT_API_KEY` 설정 확인
```bash
aws lambda get-function-configuration \
  --function-name Agrounds_player_anal \
  --query 'Environment.Variables.GPT_API_KEY'
```

### 2. 타임아웃 오류

**증상:**
```
Task timed out after 180.00 seconds
```

**해결:**
Lambda 타임아웃 300초로 증가
```bash
aws lambda update-function-configuration \
  --function-name Agrounds_player_anal \
  --timeout 300
```

### 3. OpenAI 모듈 오류

**증상:**
```
ModuleNotFoundError: No module named 'pydantic_core._pydantic_core'
```

**해결:**
Lambda Layer 재생성 및 연결
```bash
python3 create_openai_layer.py
# Layer를 Lambda에 연결
```

### 4. DB 연결 오류

**증상:**
```
PlayerAi 저장 실패: 404
```

**해결:**
Django API 엔드포인트 확인
```
POST https://agrounds.com/api/anal/save-player-ai/
```

Backend에 `Save_PlayerAi_From_Lambda` View가 있는지 확인

---

## 📁 파일 구조

```
lambda/player_anal/
├── main.py                   # Lambda handler (719 lines)
├── anal_cal.py               # GPS 분석 로직
├── summarize.py              # 쿼터 데이터 요약 (439 lines)
├── gpt.py                    # GPT 처리 (207 lines)
├── deploy_lambda.py          # 배포 스크립트
├── create_openai_layer.py    # Layer 생성 스크립트
├── check_lambda_logs.py      # 로그 확인 도구
└── README.md                 # 이 문서
```

---

## 🎯 API 엔드포인트

### Django Backend

**분석 시작:**
```
POST /api/anal/start-analysis/
{
  "user_code": "u_xxx",
  "upload_code": "upload_xxx",
  "ground_code": "ground_xxx",
  "rest_area_position": "A",
  "match_name": "경기명",
  "quarters": [...]
}
```

**분석 결과 저장 (Lambda → Django):**
```
POST /api/anal/save-result/
{
  "quarter_code": "q_xxx",
  "analysis_data": {
    "T_D": 2.12,
    "T_AS": 5.0,
    ...
  }
}
```

**AI 결과 저장 (Lambda → Django):**
```
POST /api/anal/save-player-ai/
{
  "match_code": "m_xxx",
  "answer": {
    "key_points": [
      {
        "quarter": "1쿼터",
        "label": "제목",
        "value": "값",
        "insight": "설명"
      }
    ]
  }
}
```

**상태 업데이트 (Lambda → Django):**
```
PATCH /api/anal/update-match-status/
{
  "match_code": "m_xxx",
  "status": "ai_done",
  "error_message": "optional"
}
```

---

## 💰 비용 예상

### Lambda 실행 비용
- 메모리: 1024MB
- 실행 시간: 평균 1-2분
- 예상 비용: $0.0001/요청

### GPT-5 API 비용
- 입력 토큰: 2,000-5,000 토큰
- 출력 토큰: 500-1,000 토큰
- 예상 비용: $0.02-0.10/요청

### 월간 예상 비용 (1000건 기준)
- Lambda: ~$0.10
- GPT-5: $20-100
- **총: $20-100/월**

---

## 🔒 보안

### API 키 관리
- ✅ Lambda 환경변수 암호화 저장
- ❌ 코드에 하드코딩 금지
- ❌ Git 커밋 금지

### IAM 권한 (최소 권한 원칙)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 📚 참고 자료

- [OpenAI API 문서](https://platform.openai.com/docs/api-reference)
- [AWS Lambda 환경변수](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)
- [AWS Lambda 제한](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)

---

## ✅ 체크리스트

### 배포 전
- [ ] OpenAI API 키 발급 완료
- [ ] Lambda Layer 생성 및 연결
- [ ] Lambda 환경변수 `GPT_API_KEY` 설정
- [ ] Lambda 타임아웃 300초 설정
- [ ] Lambda 메모리 1024MB 설정

### 배포 후
- [ ] Lambda 로그에서 GPT 처리 확인
- [ ] PlayerAnal 테이블 데이터 확인
- [ ] PlayerAi 테이블 데이터 확인
- [ ] PlayerMatch 상태 변화 확인 (anal → anal_done → ai → ai_done)

---

**버전:** 1.0
**최종 업데이트:** 2025-10-28
**담당:** AGROUNDS Development Team
