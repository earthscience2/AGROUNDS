# DB접속 방법 

## 1. 로컬에서 Mysqlworkbench 접속하려면 
aws ssm start-session \
 --region ap-northeast-2 \
 --target i-0ca0f7f8a4fe63354 \
 --document-name AWS-StartPortForwardingSessionToRemoteHost \
 --parameters '{"host":["agroundrds.c4mjyhzyjllp.ap-northeast-2.rds.amazonaws.com"],"portNumber":["3306"],"localPortNumber":["3306"]}'

이 코드 실행시킨뒤 workbench접속 가능


## 2. 로컬에서 백엔드 서버열려면 (python manage.py runserver --settings=agrounds.settings.local)

aws ssm start-session \
 --region ap-northeast-2 \
 --target i-0ca0f7f8a4fe63354 \
 --document-name AWS-StartPortForwardingSessionToRemoteHost \
 --parameters '{"host":["agroundrds.c4mjyhzyjllp.ap-northeast-2.rds.amazonaws.com"],"portNumber":["3306"],"localPortNumber":["3306"]}'
이거 켜놓은 상태로 Python3 manage.py runserver 해야 로컬PC에서 서버 접속가능 

## 3. EC2에서 mysql 접속하려면
ssh -i "agrounds.pem" ubuntu@ec2-3-34-141-28.ap-northeast-2.compute.amazonaws.com 로 ec2접속하고 
mysql -h agroundrds.c4mjyhzyjllp.ap-northeast-2.rds.amazonaws.com -u ground -p로 디비 접속가능 

