# Gunicorn 활성 상태 확인 명령어

## 1. 프로세스 확인
```bash
# gunicorn 프로세스 확인
ps aux | grep gunicorn

# gunicorn 프로세스 ID만 확인
pgrep gunicorn

# gunicorn 프로세스 개수 확인
ps aux | grep gunicorn | grep -v grep | wc -l
```

## 2. 포트 확인
```bash
# gunicorn이 사용하는 포트 확인
netstat -tlnp | grep gunicorn

# 또는 ss 명령어 사용
ss -tlnp | grep gunicorn

# 특정 포트 확인 (예: 8000번 포트)
netstat -tlnp | grep :8000
```

## 3. 헬스 체크
```bash
# curl을 사용한 헬스 체크
curl -I http://localhost:8000/

# 응답 시간 확인
curl -w "@-" -o /dev/null -s "http://localhost:8000/" <<'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

## 4. 로그 확인
```bash
# gunicorn 로그 실시간 확인
tail -f /var/log/gunicorn/access.log

# 에러 로그 확인
tail -f /var/log/gunicorn/error.log

# 최근 100줄 로그 확인
tail -n 100 /var/log/gunicorn/access.log

# 특정 시간 이후 로그 확인
tail -f /var/log/gunicorn/access.log | grep "$(date '+%Y-%m-%d')"
```

## 5. 시스템 리소스 확인
```bash
# gunicorn 프로세스의 CPU/메모리 사용량
top -p $(pgrep gunicorn | tr '\n' ',' | sed 's/,$//')

# 메모리 사용량 상세 확인
pmap $(pgrep gunicorn)

# 프로세스 트리 확인
pstree -p | grep gunicorn
```

## 6. 서비스 상태 확인 (systemd)
```bash
# gunicorn 서비스 상태 확인
systemctl status gunicorn

# 모든 gunicorn 관련 서비스 확인
systemctl list-units --type=service | grep gunicorn

# 서비스 로그 확인
journalctl -u gunicorn -f
```

## 7. 간단한 원라이너 명령어들
```bash
# gunicorn 실행 여부 확인
if pgrep gunicorn > /dev/null; then echo "✅ 실행 중"; else echo "❌ 중지됨"; fi

# 포트 8000에서 응답 확인
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/

# gunicorn 프로세스 개수와 포트 출력
echo "프로세스: $(ps aux | grep gunicorn | grep -v grep | wc -l)개, 포트: $(netstat -tlnp | grep gunicorn | awk '{print $4}' | cut -d: -f2 | tr '\n' ' ')"
```

## 8. 모니터링 스크립트 (간단 버전)
```bash
#!/bin/bash
# 간단한 gunicorn 상태 확인

echo "=== Gunicorn 상태 확인 ==="
echo "시간: $(date)"

# 프로세스 확인
if pgrep gunicorn > /dev/null; then
    echo "✅ 프로세스: 실행 중 ($(pgrep gunicorn | wc -l)개)"
else
    echo "❌ 프로세스: 중지됨"
fi

# 포트 확인
ports=$(netstat -tlnp 2>/dev/null | grep gunicorn | awk '{print $4}' | cut -d: -f2 | tr '\n' ' ')
if [ ! -z "$ports" ]; then
    echo "✅ 포트: $ports"
else
    echo "❌ 포트: 없음"
fi

# 헬스 체크
if command -v curl > /dev/null; then
    for port in $ports; do
        response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 3 "http://localhost:$port/" 2>/dev/null)
        if [ "$response" = "200" ]; then
            echo "✅ 헬스체크: 포트 $port 정상 ($response)"
        else
            echo "❌ 헬스체크: 포트 $port 오류 ($response)"
        fi
    done
fi

echo "========================"
```

## 9. 자동 모니터링 (cron 사용)
```bash
# crontab에 추가하여 5분마다 확인
# */5 * * * * /path/to/check_gunicorn_status.sh >> /var/log/gunicorn_monitor.log 2>&1

# 또는 1분마다 확인
# * * * * * /path/to/check_gunicorn_status.sh >> /var/log/gunicorn_monitor.log 2>&1
```

## 10. 문제 해결 명령어
```bash
# gunicorn 프로세스 강제 종료
pkill -f gunicorn

# 특정 포트 사용 프로세스 확인
lsof -i :8000

# gunicorn 재시작 (systemd)
sudo systemctl restart gunicorn

# 로그 파일 크기 확인
du -h /var/log/gunicorn/*.log

# 디스크 공간 확인
df -h
``` 