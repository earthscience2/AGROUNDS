import Link from 'next/link';
import styles from '@/styles/main.module.css';
import { useState } from 'react';

export default function Home() {
  const [isRegisterPopupOpen, setRegisterPopupOpen] = useState(false);

  const toggleRegisterPopup = () => {
    setRegisterPopupOpen(!isRegisterPopupOpen);
  };

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          AGROUNDS 비로그인 선수 페이지
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
    </div>
  );
}