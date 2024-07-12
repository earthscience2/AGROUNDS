from .base import *

DEBUG = True
ALLOWED_HOSTS = ["127.0.0.1"]
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "agroundsDB",  # RDS 데이터베이스 이름
        "USER": "ground",  # RDS 데이터베이스 사용자 이름
        "PASSWORD": "assist0907",  # RDS 데이터베이스 비밀번호
        "HOST": "127.0.0.1",  # RDS 인스턴스 엔드포인트
        "PORT": "3306",  # MySQL 기본 포트
        "OPTIONS": {"init_command": "SET sql_mode='STRICT_TRANS_TABLES'"},
    }
}