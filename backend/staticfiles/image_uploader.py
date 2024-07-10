import boto3
import uuid
from PIL import Image, UnidentifiedImageError
from io import BytesIO
from django.conf import settings
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, BotoCoreError

class S3ImgUploader:
    def __init__(self, file, filename):
        self.file = file
        # self.filename = f"img/teamlogo/{uuid.uuid1().hex}.jpg"
        self.filename = f"img/teamlogo/{uuid.uuid1().hex}.jpg"
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