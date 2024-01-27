import Link from 'next/link';
import styles from '/src/styles/home.module.css';
import signup from '/src/styles/signup.module.css';
import { useState } from 'react';

export default function Home() {

  // 각 필드에 대한 상태
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    fullname: '',
    birthdate: '',
    gender: '',
    agreeAll: false,
    agree1: false,
    agree2: false,
    agree3: false,
  });

  // 입력 변경 처리 함수
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 폼 제출 처리 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 유효성 검사 로직 추가
    // 폼 데이터를 백엔드로 전송하는 로직 추가
  };

  const [nickname, setNickname] = useState('');
  const [nicknameValid, setNicknameValid] = useState(true);

  const checkNickname = async () => {
    // Django 백엔드로 닉네임 중복 확인 API 요청
    try {
      const response = await fetch(`/api/login/nickname?nickname=${nickname}`);
      const data = await response.json();
      setNicknameValid(data.isAvailable); // 예: 응답에서 닉네임 사용 가능 여부를 받음
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
    }
  };

  const [isRegisterPopupOpen, setRegisterPopupOpen] = useState(false);

  const toggleRegisterPopup = () => {
    setRegisterPopupOpen(!isRegisterPopupOpen);
  };

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          AGROUNDS 비로그인 일반 회원가입 페이지
        </h1>

        <nav className={styles.navbar}>
          <Link href="/" passHref><span>홈</span></Link>
          <Link href="/leagues" passHref><span>리그&컵</span></Link>
          <Link href="/matches" passHref><span>경기</span></Link>
          <Link href="/teams" passHref><span>팀</span></Link>
          <Link href="/players" passHref><span>선수</span></Link>
          <Link href="/coaches" passHref><span>감독</span></Link>
          <Link href="/device" passHref><span>장비</span></Link>
          <button onClick={toggleRegisterPopup}>회원가입</button>
            {isRegisterPopupOpen && (
              <div className={styles.registerPopup}>
                <Link href="/signup" passHref><span>AGROUNDS로 회원가입</span></Link>
                <Link href="/signup/kakao" passHref><span>카카오로 회원가입</span></Link>
                <Link href="/signup/google" passHref><span>구글로 회원가입</span></Link>
              </div>
            )}
          <Link href="/login" passHref><span>로그인</span></Link>
        </nav>
      </main>
      <div className={signup.signupContainer}>
      <h1>회원가입</h1>
      <form className={signup.signupForm} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">아이디/이메일:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div>
          <label htmlFor="confirmPassword">비밀번호 확인:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required />
        </div>
        <div>
          <label htmlFor="nickname">닉네임:</label>
          <input 
            type="text" 
            id="nickname" 
            name="nickname" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required 
          />
          <button type="button" onClick={checkNickname}>중복 확인</button>
        </div>
        {!nicknameValid && <p>이미 사용 중인 닉네임입니다.</p>}
        <div>
          <label htmlFor="fullname">이름:</label>
          <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="birthdate">생년월일 (YYYYMMDD):</label>
          <input type="text" id="birthdate" name="birthdate" value={formData.birthdate} onChange={handleChange} required maxLength="8" />
        </div>
        <div>
          <label>성별:</label>
          <input type="radio" id="male" name="gender" value="male" onChange={handleChange} checked={formData.gender === 'male'} required />
          <label htmlFor="male">남</label>
          <input type="radio" id="female" name="gender" value="female" onChange={handleChange} checked={formData.gender === 'female'} required />
          <label htmlFor="female">여</label>
        </div>
        <div>
          <input type="checkbox" id="agreeAll" name="agreeAll" checked={formData.agreeAll} onChange={handleChange} />
          <label htmlFor="agreeAll">모든 약관 동의</label>
        </div>
        <div>
          <input type="checkbox" id="agree1" name="agree1" checked={formData.agree1} onChange={handleChange} required />
          <label htmlFor="agree1">약관1 동의 (필수)</label>
        </div>
        <div>
          <input type="checkbox" id="agree2" name="agree2" checked={formData.agree2} onChange={handleChange} required />
          <label htmlFor="agree2">약관2 동의 (필수)</label>
        </div>
        <div>
          <input type="checkbox" id="agree3" name="agree3" checked={formData.agree3} onChange={handleChange} />
          <label htmlFor="agree3">약관3 동의 (선택)</label>
        </div>
        <button type="submit">가입하기</button>
      </form>
    </div>
    </div>
   


  

  );
}