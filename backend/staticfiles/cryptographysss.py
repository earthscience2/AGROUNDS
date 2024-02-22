"""
민감한 정보를 암호화 하기 위한 모듈
"""
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from base64 import b64encode, b64decode

secret_key = "2a0g2r4o0u2n2d1s"
iv = b'\xd5>|t\xe1\xbdw\x11\xb0\xe7\xf6z\xde.+\xb7'

def encrypt_aes(plaintext):
    key = secret_key.encode('utf-8')
    plaintext = plaintext.encode('utf-8')

    # AES CBC 모드 사용
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # 패딩을 추가하고 암호문을 생성
    ciphertext = encryptor.update(plaintext) + encryptor.finalize()

    # Base64로 인코딩하여 문자열로 반환
    return b64encode(ciphertext).decode('utf-8')

def decrypt_aes(ciphertext):
    key = secret_key.encode('utf-8')
    ciphertext = b64decode(ciphertext.encode('utf-8'))

    # AES CBC 모드 사용
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    # 복호화
    plaintext = decryptor.update(ciphertext) + decryptor.finalize()

    return plaintext.decode('utf-8')