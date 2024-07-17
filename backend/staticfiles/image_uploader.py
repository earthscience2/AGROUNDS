import boto3
from PIL import Image, UnidentifiedImageError
from io import BytesIO
from django.conf import settings
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, BotoCoreError
import uuid

class S3ImgUploader:
    '''
        파일과 파일 경로를 파라메터로 넘겨주면
        s3버킷에 업로드
        사용법 : 
        1. S3ImgUploader import 하기 - from staticfiles.image_uploader import S3ImgUploader
        2. S3ImgUploader 객체 생성하기 파라메터 : 파일, 파일경로 - ex) uploader = S3ImgUploader(file, img/logo/)
        3. upload 실행 - fileUploader.upload() / try catch문 사용하여 예외처리 가능
        4. uploader.url로 파일이 업로드된 url을 가져올 수 있음. 
           DB에는 파일 전체 url이 아닌 파일 이름이 포함된 경로만 저장하고, 불러올 때는 staticfiles.get_file_url의 get_file_url 
           함수로 전체 url 불러오는 것을 권장.(S3 버킷 주소가 변경될 수 있기 때문)
    '''
    def __init__(self, file, filedir):
        self.file = file
        self.filename = filedir + f"{uuid.uuid1().hex}.jpg"
        self.url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{self.filename}"
    
    def compress_image(self, file):
        try:
            image = Image.open(file)
        except UnidentifiedImageError:
            raise ValueError("Invalid image file.")
        
        output = BytesIO()
        
        # Set compression quality
        quality = 85
        
        # Save image for compression
        try:
            image.save(output, format='JPEG', quality=quality)
        except OSError as e:
            raise ValueError(f"Image compression failed: {e}")
        
        output.seek(0)
        
        # Reduce quality iteratively if the compressed image size is still greater than 1MB
        while output.tell() > 1 * 1024 * 1024:
            output = BytesIO()
            quality -= 5
            if quality < 10:  # Prevent infinite loop with very small quality
                raise ValueError("Unable to compress image to desired size.")
            try:
                image.save(output, format='JPEG', quality=quality)
            except OSError as e:
                raise ValueError(f"Image compression failed: {e}")
            output.seek(0)
        
        return output

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

        # Compress the file if it is larger than 1MB
        if self.file.size > 1 * 1024 * 1024:
            try:
                self.file = self.compress_image(self.file)
            except ValueError as e:
                raise ValueError(f"Image compression error: {e}")
        
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