import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import CompanyInfo from "../../Components/Common/CompanyInfo";
import Logo from "../../assets/logo5.png";
import styles from "./ASigninPage.module.css";
import TextInput from "../../Components/Common/TextInput";
import { useState } from "react";
import SelectGender from "../../Components/Common/SelectGender";
import AgreeCheckbox from "../../Components/Common/AgreeCheckbox";
import Image from 'next/image';


function SigninPage() {
    // 닉네임 중복 확인
    const [nickname, setNickname] = useState('');
    const [nicknameValid, setNicknameValid] = useState(undefined);
    const [message, setMessage] = useState('');
    const [animate, setAnimate] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    const validateNickname = (nickname) => {
        const regex = /^[가-힣a-z0-9-_]{3,10}$/;
        return regex.test(nickname);
    };

    const triggerAnimation = () => {
        setAnimationKey(prevKey => prevKey + 0.2);
    }

    const checkNicknameDuplication = async () => {
        if (!validateNickname(nickname)) {
            setMessage('영어소문자, 한글, 숫자, 기호, 3글자~10글자, 공백 불가');
            setNicknameValid(false);
            triggerAnimation();
            return;
        }

        try {
            const url = `https://agrounds.com/api/login/nickname/?nickname=${encodeURIComponent(nickname)}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.isAvailable) {
                setMessage('사용 가능한 닉네임입니다.');
                setNicknameValid(true);
            } else {
                setMessage('사용 불가능한 닉네임입니다.');
                setNicknameValid(false);
            }
        } catch (error) {
            console.error('API 요청 중 오류 발생:', error);
        }
    }

    const [inputValue, setInputValue] = useState('');
    const [dateValid, setDateValid] = useState(true);
    const [dateErrorMessage, setDateErrorMessage] = useState('');

    const handleInputChange = (event) => {
        const { value } = event.target;
        // 입력된 값이 숫자이며 8자리 이하인지 확인
        if (/^\d{0,8}$/.test(value)) {
            setInputValue(value);

            if (value.length === 8) {
                // 날짜 유효성 검사 로직
                const year = parseInt(value.substring(0, 4), 10);
                const month = parseInt(value.substring(4, 6), 10) - 1;
                const day = parseInt(value.substring(6, 8), 10);

                const date = new Date(year, month, day);
                const now = new Date();

                if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day &&
                    year >= 1900 && date <= now) {
                    setDateValid(true);
                    setDateErrorMessage('');
                } else {
                    setDateValid(false);
                    setDateErrorMessage('유효하지 않은 날짜입니다.');
                }
            } else {
                setDateValid(false);
                setDateErrorMessage('생년월일은 8자리 숫자여야 합니다.');
            }
        }
    }

    return (
        <div className={styles.backg}>
            <NavBar />
            <form>
                <div className={styles.back}>
                    <div className={styles.block1}>
                        <Image className={styles.icon} src={Logo} />
                        AGROUNDS로 회원가입
                    </div>
                    <TextInput text="아이디" type="email" placeholder="이메일" />
                    <TextInput text="비밀번호" type="password" placeholder="비밀번호" />
                    <TextInput text="비밀번호 확인" type="password" placeholder="비밀번호 재입력" />
                    <div className={styles.block2}>
                        <div className={styles.name}>닉네임</div>
                        <input className={styles.input}
                            type="text"
                            placeholder="닉네임"
                            onChange={(e) => setNickname(e.target.value)}
                            value={nickname}>
                        </input>
                        <div className={styles.checkdup} onClick={checkNicknameDuplication}>중복확인</div>
                    </div>
                    <div key={animationKey} className={nicknameValid === false ? styles.errorMessage : styles.normalMessage} onAnimationEnd={() => setAnimate(false)}>
                        {message}
                    </div>

                    <TextInput text="이름" type="text" placeholder="실명" />

                    <TextInput text="생년월일"
                        type="text"
                        id="birthday"
                        placeholder="8자리 (YYYYMMDD)"
                        value={inputValue}
                        maxLength={8}
                        onChange={handleInputChange} />
                    {!dateValid && <div style={{ color: 'red' }}>유효하지 않은 날짜입니다.</div>}

                    <div >
                        <SelectGender color="#055540" />
                    </div>

                    <AgreeCheckbox color="#055540" />
                    <button className={styles.submit}>가입하기</button>
                </div>
            </form>
            <CompanyInfo />
        </div>
    )
}
export default SigninPage;