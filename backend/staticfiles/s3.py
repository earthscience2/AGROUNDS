import boto3
from botocore.exceptions import ClientError
from django.conf import settings
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, BotoCoreError
import json

import requests

class CloudFrontTxtFileReader:
    '''
        Read txt files as strings from a CloudFront URL.
        Usage:
        1. Create an object: reader = CloudFrontTxtFileReader([base_url])
        2. Read a file as a string: content = reader.read([file_path])
    '''
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')  # Ensure no trailing slash

    def read(self, file_path):
        '''
            Read the file from CloudFront as a string
        '''
        file_url = f"{self.base_url}/{file_path.lstrip('/')}"  # Construct full URL
        try:
            response = requests.get(file_url)
            response.raise_for_status()  # Raise an error for non-2xx responses
            return response.text  # Return file content as string
        except requests.exceptions.HTTPError as http_err:
            if response.status_code == 404:
                raise ValueError(f"The file '{file_path}' does not exist at {file_url}.")
            else:
                raise ValueError(f"HTTP error occurred: {http_err}")
        except requests.exceptions.RequestException as req_err:
            raise ValueError(f"Error fetching file from CloudFront: {req_err}")


class S3TxtFileReader:
    '''
        s3버킷에서 txt파일을 string으로 읽어옴
        사용법
        1. 객체생성 : reader = S3TxtFileReader([버킷이름])
        2. 파일을 string으로 읽어오기 : str = reader.read([파일경로])
    '''
    def __init__(self, bucket_name):
        self.bucket_name = bucket_name

    def read(self, file_key):
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
            s3_client.head_object(Bucket=self.bucket_name, Key=file_key)

            response = s3_client.get_object(Bucket=self.bucket_name, Key=file_key)
            file_content = response['Body'].read().decode('utf-8')
            return file_content
        
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                raise ValueError(f"The file with key '{file_key}' does not exist.")
            else:
                raise ValueError(f"Error reading file from S3: {e}")

# bucket_name = 'aground-aisdfis'
# file_key = 'demo/gps/AAAAAA_20241017_1/gpt.json'

# reader = S3TxtFileReader(bucket_name)
# file_content = reader.read(file_key)
# if file_content:
#     json_data = json.loads(file_content)