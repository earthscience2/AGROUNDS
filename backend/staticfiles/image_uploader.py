import boto3
import uuid
from PIL import Image
from io import BytesIO
from django.conf import settings

class S3ImgUploader:
    def __init__(self, file):
        self.file = file
        self.filename = uuid.uuid1().hex
        self.url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/img/{self.filename}"
    
    def compress_image(self, file):
        image = Image.open(file)
        output = BytesIO()
        
        # 압축 품질 설정
        quality = 85
        
        # 압축을 위한 이미지 저장
        image.save(output, format='JPEG', quality=quality)
        output.seek(0)
        
        # 압축된 이미지 크기가 1MB 이상인 경우 반복적으로 품질을 줄여서 저장
        while output.tell() > 1 * 1024 * 1024:
            output = BytesIO()
            quality -= 5
            image.save(output, format='JPEG', quality=quality)
            output.seek(0)
        
        return output

    def upload(self):
        '''
        파일 업로더
        '''
        s3_client = boto3.client(
            's3',
            aws_access_key_id     = settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        # 파일 크기가 1MB 이상일 경우 압축 진행
        if self.file.size > 1 * 1024 * 1024:
            self.file = self.compress_image(self.file)
        
        s3_client.upload_fileobj(
            self.file,
            settings.AWS_STORAGE_BUCKET_NAME,
            self.filename,
            ExtraArgs={
                "ContentType": self.file.content_type
            }
        )
        return f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/img/{url}"