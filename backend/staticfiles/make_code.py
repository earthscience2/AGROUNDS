from datetime import datetime

def decimal_to_base32(decimal_number):
    if decimal_number < 0:
        raise ValueError("음수는 처리할 수 없습니다.")

    base32_digits = "0123456789abcdefghijklmnopqrstuv"
    base32_result = ""

    while decimal_number > 0:
        remainder = decimal_number % 32
        base32_result = base32_digits[remainder] + base32_result
        decimal_number //= 32

    if not base32_result:
        base32_result = "0"

    return base32_result

def make_decimal():
    datenow = datetime.now()
    codeformet = str(datenow.year)

    if(datenow.month < 10):
        codeformet += '0'
    codeformet += str(datenow.month)

    codeformet += str(datenow.day)

    if(datenow.hour < 10):
        codeformet += '0'
    codeformet += str(datenow.hour)

    if(datenow.minute < 10):
        codeformet += '0'
    codeformet += str(datenow.minute)

    if(datenow.second < 10):
        codeformet += '0'
    codeformet += str(datenow.second)

    if(datenow.microsecond < 10):
        codeformet += '0'
    codeformet += str(datenow.microsecond)
    
    return codeformet

def make_code(code_type):
    decimal_number_code = make_decimal()
    code_front_len = int(len(decimal_number_code)/2)
    code_back_len = len(decimal_number_code) - code_front_len
    code_front = decimal_to_base32(int(decimal_number_code[0:code_front_len]))
    code_back = decimal_to_base32(int(decimal_number_code[code_front_len:code_front_len+code_back_len]))
    code = code_type + "_"
    code += (code_front + code_back)
    return code