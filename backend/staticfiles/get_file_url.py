def get_base_url():
    return 'https://d3lgojruk6udwb.cloudfront.net/'

def get_file_url(path):
    return get_base_url()+path

def get_aidsfs_file_url(path):
    baseUrl = 'https://aground-aisdfis.s3.ap-northeast-2.amazonaws.com'
    return baseUrl+path

def get_upload_url(path):
    return f'https://agrounds-image-bucket.s3.ap-northeast-2.amazonaws.com/{path}'