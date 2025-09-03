#!/bin/bash

# Gunicorn 활성 상태 확인 스크립트
# 사용법: ./check_gunicorn_status.sh

echo "🚀 Gunicorn 활성 상태 확인 시작"
echo "=================================================="
echo "확인 시간: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 1. Gunicorn 프로세스 확인
echo "=== Gunicorn 프로세스 상태 확인 ==="
gunicorn_processes=$(ps aux | grep -v grep | grep gunicorn)

if [ -z "$gunicorn_processes" ]; then
    echo "❌ 실행 중인 gunicorn 프로세스가 없습니다."
    gunicorn_running=false
else
    echo "✅ 실행 중인 gunicorn 프로세스:"
    echo "$gunicorn_processes" | while read line; do
        echo "  $line"
    done
    gunicorn_running=true
fi
echo ""

# 2. Gunicorn 포트 확인
echo "=== Gunicorn 포트 상태 확인 ==="
# netstat 또는 ss 명령어 사용
if command -v netstat &> /dev/null; then
    gunicorn_ports=$(netstat -tlnp 2>/dev/null | grep gunicorn | awk '{print $4}' | cut -d: -f2 | sort -u)
elif command -v ss &> /dev/null; then
    gunicorn_ports=$(ss -tlnp 2>/dev/null | grep gunicorn | awk '{print $4}' | cut -d: -f2 | sort -u)
else
    echo "⚠️  netstat 또는 ss 명령어를 찾을 수 없습니다."
    gunicorn_ports=""
fi

# 일반적인 포트들도 확인
common_ports="8000 8001 8002 8080 9000 5000"
for port in $common_ports; do
    if command -v netstat &> /dev/null; then
        if netstat -tlnp 2>/dev/null | grep ":$port " > /dev/null; then
            gunicorn_ports="$gunicorn_ports $port"
        fi
    elif command -v ss &> /dev/null; then
        if ss -tlnp 2>/dev/null | grep ":$port " > /dev/null; then
            gunicorn_ports="$gunicorn_ports $port"
        fi
    fi
done

# 중복 제거 및 정렬
gunicorn_ports=$(echo $gunicorn_ports | tr ' ' '\n' | sort -u | tr '\n' ' ')

if [ -z "$gunicorn_ports" ]; then
    echo "❌ 활성 gunicorn 포트를 찾을 수 없습니다."
else
    echo "✅ 활성 포트: $gunicorn_ports"
fi
echo ""

# 3. Gunicorn 헬스 체크
echo "=== Gunicorn 헬스 체크 ==="
if [ ! -z "$gunicorn_ports" ]; then
    for port in $gunicorn_ports; do
        echo "포트 $port 확인 중..."
        
        # curl을 사용한 헬스 체크
        if command -v curl &> /dev/null; then
            # 여러 엔드포인트 시도
            endpoints="/health/ /health /status/ /status / /api/health/ /api/status/"
            for endpoint in $endpoints; do
                response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "http://localhost:$port$endpoint" 2>/dev/null)
                if [ "$response" = "200" ]; then
                    echo "✅ http://localhost:$port$endpoint - 상태 코드: $response"
                    break
                else
                    echo "❌ http://localhost:$port$endpoint - 상태 코드: $response"
                fi
            done
        else
            echo "⚠️  curl 명령어를 찾을 수 없습니다."
        fi
        echo ""
    done
else
    echo "❌ 확인할 포트가 없습니다."
fi

# 4. Gunicorn 로그 확인
echo "=== Gunicorn 로그 확인 ==="
log_paths="/var/log/gunicorn/ /var/log/gunicorn.log /var/log/gunicorn/access.log /var/log/gunicorn/error.log ./logs/ ./gunicorn.log ./gunicorn-access.log ./gunicorn-error.log"

found_logs=false
for log_path in $log_paths; do
    if [ -e "$log_path" ]; then
        if [ -d "$log_path" ]; then
            # 디렉토리인 경우
            for file in "$log_path"/*; do
                if [[ "$file" == *gunicorn* ]]; then
                    echo "✅ 로그 파일: $file"
                    echo "  크기: $(du -h "$file" 2>/dev/null | cut -f1)"
                    echo "  수정시간: $(stat -c %y "$file" 2>/dev/null | cut -d' ' -f1,2)"
                    echo "  최근 로그 (마지막 3줄):"
                    tail -n 3 "$file" 2>/dev/null | sed 's/^/    /'
                    echo ""
                    found_logs=true
                fi
            done
        else
            # 파일인 경우
            echo "✅ 로그 파일: $log_path"
            echo "  크기: $(du -h "$log_path" 2>/dev/null | cut -f1)"
            echo "  수정시간: $(stat -c %y "$log_path" 2>/dev/null | cut -d' ' -f1,2)"
            echo "  최근 로그 (마지막 3줄):"
            tail -n 3 "$log_path" 2>/dev/null | sed 's/^/    /'
            echo ""
            found_logs=true
        fi
    fi
done

if [ "$found_logs" = false ]; then
    echo "❌ gunicorn 로그 파일을 찾을 수 없습니다."
fi

# 5. 시스템 리소스 확인
echo "=== 시스템 리소스 사용량 ==="
echo "CPU 사용률: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "메모리 사용률: $(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')%"
echo "사용 가능한 메모리: $(free -h | grep Mem | awk '{print $7}')"
echo "디스크 사용률: $(df -h / | tail -1 | awk '{print $5}')"
echo "사용 가능한 디스크: $(df -h / | tail -1 | awk '{print $4}')"
echo ""

# 6. Gunicorn 설정 파일 확인
echo "=== Gunicorn 설정 파일 확인 ==="
config_files="gunicorn.conf.py gunicorn.conf gunicorn.py gunicorn.ini"
found_config=false

for config in $config_files; do
    if [ -f "$config" ]; then
        echo "✅ 설정 파일: $config"
        echo "  크기: $(du -h "$config" | cut -f1)"
        echo "  수정시간: $(stat -c %y "$config" | cut -d' ' -f1,2)"
        found_config=true
    fi
done

if [ "$found_config" = false ]; then
    echo "❌ gunicorn 설정 파일을 찾을 수 없습니다."
fi
echo ""

# 7. Gunicorn 서비스 상태 확인 (systemd)
echo "=== Gunicorn 서비스 상태 확인 (systemd) ==="
if command -v systemctl &> /dev/null; then
    gunicorn_services=$(systemctl list-units --type=service --state=running | grep -i gunicorn)
    if [ ! -z "$gunicorn_services" ]; then
        echo "✅ 실행 중인 gunicorn 서비스:"
        echo "$gunicorn_services"
    else
        echo "❌ 실행 중인 gunicorn 서비스가 없습니다."
    fi
else
    echo "⚠️  systemctl 명령어를 찾을 수 없습니다."
fi
echo ""

# 종합 결과
echo "=================================================="
echo "📊 종합 결과:"
if [ "$gunicorn_running" = true ]; then
    echo "✅ Gunicorn이 실행 중입니다."
else
    echo "❌ Gunicorn이 실행되지 않고 있습니다."
fi

if [ ! -z "$gunicorn_ports" ]; then
    echo "✅ 활성 포트: $gunicorn_ports"
else
    echo "❌ 활성 포트가 없습니다."
fi

echo ""
echo "🔧 추가 확인 명령어들:"
echo "  - 프로세스 상세 확인: ps aux | grep gunicorn"
echo "  - 포트 상세 확인: netstat -tlnp | grep gunicorn"
echo "  - 로그 실시간 확인: tail -f /var/log/gunicorn/access.log"
echo "  - 프로세스 트리 확인: pstree -p | grep gunicorn"
echo "  - 메모리 사용량 상세: pmap \$(pgrep gunicorn)" 