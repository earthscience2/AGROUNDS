from openai import OpenAI 
import json
import tiktoken
import os
import summarize

# Lambda 환경변수에서 API 키 읽기
def get_openai_client():
    """OpenAI 클라이언트 생성 (환경변수 또는 파일에서 키 읽기)"""
    api_key = os.environ.get('GPT_API_KEY')
    
    if not api_key:
        # 로컬 테스트용: GPT_API_KEY.json 파일 읽기
        try:
            with open('GPT_API_KEY.json', 'r', encoding='utf-8') as file:
                key_data = json.load(file)
                api_key = key_data.get('key')
        except FileNotFoundError:
            raise ValueError("GPT_API_KEY 환경변수가 설정되지 않았고, GPT_API_KEY.json 파일도 없습니다.")
    
    if not api_key:
        raise ValueError("GPT API 키를 찾을 수 없습니다.")
    
    return OpenAI(api_key=api_key) 

# ===============================================
# json 파일 불러오기
# ===============================================
def load_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# ===============================================
# JSON 형식으로 변환
# ===============================================
def clean_and_convert_to_dict(response_text):
    # '{'와 '}' 문자의 위치 찾기
    start_idx = response_text.find('{')
    end_idx = response_text.rfind('}') + 1  # '}'를 포함하기 위해 +1

    if start_idx == -1 or end_idx <= 0:
        print("JSON 변환 중 오류 발생: JSON 구분자를 찾지 못했습니다.")
        return {"error": "Invalid JSON format"}

    # 문자열 슬라이싱하여 JSON 문자열만 추출
    json_string = response_text[start_idx:end_idx]

    try:
        # 슬라이싱된 JSON 문자열을 딕셔너리로 변환
        result_dict = json.loads(json_string)
    except json.JSONDecodeError as e:
        print(f"JSON 변환 중 오류 발생: {e}")
        result_dict = {"error": "Invalid JSON format"}
    
    return result_dict

# ===============================================
# 토큰 수 카운트
# ===============================================
def count_tokens(text: str, model: str = "gpt-4o") -> int:
    # 모델 이름에서 적절한 인코더 자동 추론
    enc = tiktoken.encoding_for_model(model)
    return len(enc.encode(text))

# ===============================================
# GPT 선수분석결과  
# ===============================================
def main(user_info, request, anal_data, file_name): 
    # GPT 결과 저장 디렉토리 생성
    gpt_dir = "result/player/gpt"
    if not os.path.exists(gpt_dir):
        os.makedirs(gpt_dir)
    
    gpt_file_route = os.path.join(gpt_dir, file_name + "_gpt_result.json")
    print(f"GPT 결과 저장 경로: {gpt_file_route}")
    
    # OpenAI 클라이언트 생성
    client = get_openai_client()
    
    # 사용자 입력 생성
    question =  "사용자 정보" + "\n" + \
                user_info + "\n" + \
                "쿼터별 데이터 분석 결과" + "\n" + \
                anal_data + "\n" + \
                request
                
    print("입력 토큰 수 : " + str(count_tokens(question, "gpt-4o")))
    
    # GPT 요청 메시지
    print(question)
    
    # GPT 요청 및 응답 검증 (최대 3회 재시도)
    max_attempts = 3
    attempt = 0
    last_error = None
    answer_dict = {"error": "AI request not executed"}

    while attempt < max_attempts:
        attempt += 1
        try:
            print(f"🧠 GPT 요청 시도 {attempt}/{max_attempts}")
            response = client.responses.create(
                model="gpt-5",
                input=question,
                reasoning={
                    "effort": "minimal"
                }
            )
            answer = response.output_text
            answer_dict = clean_and_convert_to_dict(answer)

            if (
                isinstance(answer_dict, dict)
                and "error" not in answer_dict
                and isinstance(answer_dict.get("key_points"), list)
                and len(answer_dict["key_points"]) > 0
            ):
                print("✅ GPT 응답이 정상 형식입니다.")
                break

            last_error = answer_dict.get("error", "Missing key_points in response")
            print(f"⚠️ GPT 응답 검증 실패: {last_error}")
        except Exception as e:
            last_error = str(e)
            print(f"❌ GPT 응답 생성 실패 (시도 {attempt}): {last_error}")

    if attempt == max_attempts and ("error" in answer_dict or "key_points" not in answer_dict):
        answer_dict = {
            "error": "AI_ANALYSIS_FAILED",
            "message": last_error or "Failed to obtain valid AI response after retries."
        }
        print("🚨 GPT 재시도 한도 초과: 오류 결과를 저장합니다.")

    # 결과 저장 디렉터리 생성 보장
    with open(gpt_file_route, 'w', encoding='utf-8') as json_file:
        json.dump(answer_dict, json_file, ensure_ascii=False, indent=4)


# ===============================================
# 개인 분석 GPT 처리 메인 함수
# ===============================================
def process_individual_gpt(file_name: str, user_info: str = None):
    """개인 분석 결과를 GPT로 처리하는 메인 함수"""
    
    # OpenAI 클라이언트 검증
    try:
        get_openai_client()
    except ValueError as e:
        print(f"❌ GPT 클라이언트 생성 실패: {e}")
        raise
    
    # 기본 사용자 정보 설정
    if user_info is None:
        user_info = "나이 : 25세\n" + \
                   "키 : 170cm\n" + \
                   "몸무게 : 70kg\n" + \
                   "선호 포지션 : CM\n"
    
    # 쿼터별 JSON 파일 경로 생성
    quarter_list = [f"result/player/anal/{file_name}_1쿼터_result.json",
                   f"result/player/anal/{file_name}_2쿼터_result.json", 
                   f"result/player/anal/{file_name}_3쿼터_result.json",
                   f"result/player/anal/{file_name}_4쿼터_result.json"]
    
    # 각 쿼터 데이터를 요약하여 통합
    anal_data = ""
    quarter_names = ["1쿼터", "2쿼터", "3쿼터", "4쿼터"]
    
    for i, summarize_file in enumerate(quarter_list):
        try:
            quarter_data = summarize.summarize_file(summarize_file)
            if quarter_data.strip():  # 데이터가 있을 때만 추가
                anal_data += f"\n=== {quarter_names[i]} ===\n"
                anal_data += quarter_data + "\n"
        except Exception as e:
            print(f"파일 요약 오류 ({summarize_file}): {e}")
    prompt_talk_type = "친근하고 전문적인 스포츠 분석가 톤으로 답변해줘"
    
    # GPT 요청 프롬프트 구성 (구조화된 형태)
    request = f"""
        ## 🎯 맥락 (CONTEXT)
        당신은 축구 선수의 GPS 데이터를 분석하여 경기력을 평가하는 전문 분석가입니다.
        제공된 쿼터별 데이터를 바탕으로 선수의 핵심 성과 포인트를 식별하고 설명해야 합니다.
        
        ## 👤 페르소나 (PERSONA)
        - 친근하고 전문적인 스포츠 분석가
        - 복잡한 데이터를 쉽게 설명하는 커뮤니케이터
        - 선수의 강점과 특징을 발견하는 전문가
        
        ## 📋 규칙 (RULES)
        1. 제공된 데이터에서 가장 눈에 띄는 5가지 핵심 포인트만 선별
        2. 각 포인트는 선수가 실제로 보여준 성과나 특징을 중심으로 설명
        3. 복잡한 용어는 쉽게 풀어서 설명
        4. 구체적인 수치와 함께 의미를 설명
        5. 공과 관련된 설명은 제외하고 순수한 움직임 데이터만 분석
        6. 제공된 지표 데이터에만 기반하여 설명 (추측이나 가정 금지)
        7. 리스트 구성은 쿼터 순서대로 정렬
        
        ## 📝 포함할 내용 (CONTENT)
        - 가장 인상적인 수치나 기록
        - 쿼터별로 눈에 띄는 변화나 특징
        - 선수의 강점이나 특별한 활동 패턴
        - 경기 흐름에 영향을 준 중요한 지표들
        - label은 자극적이고 흥미로운 제목으로 설정
        
        ## 🎨 어조 (TONE)
        - {prompt_talk_type}
        
        ## 📊 출력 형식 (FORMAT)
        반드시 아래 JSON 형식으로만 응답:
        {{
            "key_points": [
                {{"quarter": "해당쿼터", "label": "제목", "value": "값과 단위", "insight": "이 수치가 왜 중요한지, 선수가 어떤 모습을 보였는지 생생하게 설명"}},
                {{"quarter": "...", "label": "...", "value": "...", "insight": "..."}}
            ]
        }}
        """
    
    # GPT 처리 실행
    print(f"📊 개인 분석 GPT 처리 시작: {file_name}")
    return main(user_info, request, anal_data, file_name)

# ===============================================
# 최종 실행 (main)
# ===============================================
if __name__ == "__main__":
    file_name = "p_002"
    
    # 사용자 정보 설정
    user_info = "나이 : 25세\n" + \
                "키 : 170cm\n" + \
                "몸무게 : 70kg\n" + \
                "선호 포지션 : CM\n"
    
    # 개인 분석 GPT 처리
    process_individual_gpt(file_name, user_info)
