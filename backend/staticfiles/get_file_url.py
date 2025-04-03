import boto3

def generate_presigned_url(object_name):
    s3_client = boto3.client('s3')
    bucket_name = 'agrounds-image-bucket'
    try:
        url = s3_client.generate_presigned_url(
            'put_object',
            Params={'Bucket': bucket_name, 'Key': object_name},
            ExpiresIn=3600  # URL 만료 시간
        )
        return url
    except Exception as e:
        print(f"Error generating presigned URL: {e}")
        return None

def get_base_url():
    return 'https://d3lgojruk6udwb.cloudfront.net/'

def get_file_url(path):
    return get_base_url()+path

def get_aidsfs_file_url(path):
    baseUrl = 'https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com'
    return baseUrl+path

def get_upload_url(path):
    return generate_presigned_url(path)