import boto3
from django.conf import settings
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, BotoCoreError

class S3FileUploader:
    '''
        파일과 파일 이름(경로)을 파라메터로 넘겨주면
        s3버킷에 업로드
        사용법 : 
        1. S3FileUploder import 하기 - from staticfiles.file_uploader import S3FileUploader
        2. S3FileUploder 객체 생성하기 파라메터 : 파일, 파일경로 - ex) fileUploader = S3FileUploader(file, img/logo/테스트.txt)
        3. upload 실행 - fileUploader.upload() / try catch문 사용하여 예외처리 가능
        4. fileUploader.url로 파일이 업로드된 url을 가져올 수 있음. 
           DB에는 파일 전체 url이 아닌 파일 이름이 포함된 경로만 저장하고, 불러올 때는 staticfiles.get_file_url의 get_file_url 
           함수로 전체 url 불러오는 것을 권장.(S3 버킷 주소가 변경될 수 있기 때문)
    '''
    def __init__(self, file, filename):
        self.file = file
        self.filename = filename
        self.url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{self.filename}"

    def upload(self):
        '''
            Upload the file to S3
        '''
        try:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )

        except (NoCredentialsError, PartialCredentialsError):
            raise ValueError("AWS credentials are not available or incomplete.")
        except BotoCoreError as e:
            raise ValueError(f"Failed to create S3 client: {e}")
        
        try:
            # 업로드 전에 파일 포인터의 위치를 처음 위치로 초기화
            self.file.seek(0)
            s3_client.upload_fileobj(
                self.file,
                settings.AWS_STORAGE_BUCKET_NAME,
                self.filename,
                ExtraArgs={
                    'ContentType': self.file.content_type
                }
            )
        except BotoCoreError as e:
            raise ValueError(f"Failed to upload file to S3: {e}")
        
        return self.url