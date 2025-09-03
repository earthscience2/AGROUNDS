import { useEffect } from 'react';
import './loading.scss'
import client from '../../client';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('code');
    const type = url.searchParams.get('type');

    const navigate = useNavigate();
    // 카카오 로그인 시 token이 url parameter로 들어오는지 검사하고,
    // 들어오고 있으면 token을 api에 전송하여 유저 정보 불러옴
    useEffect(()=>{
        if (token === '0' && type !== 'apple'){
            let hostname = window.location.hostname
            if(hostname !== 'localhost')
                hostname = 'agrounds.com'
            const base = (window.location.hostname === 'localhost')
              ? `${window.location.protocol}//localhost:8000`
              : '';
            window.location.replace(base + "/api/login/kakao/?hostname=" + hostname + "&theme=light");
        } else {
            setTimeout(loader, 1000 * 1);
        }
    },[])

    function loader() {
        console.log('=== Loading Page Debug ===');
        console.log('token:', token);
        console.log('type:', type);
        console.log('URL:', window.location.href);
        
        if(token === null){
            console.log('token is not comming');
            alert('로그인 실패 : 토큰이 null 입니다.');
            window.location.replace('/app');
        } else {
            console.log('Token found, calling API...');
            console.log('Raw token from URL:', token);
            console.log('Token length:', token.length);
            console.log('Token type:', typeof token);
            console.log('Is token empty?', token === '' || token.trim() === '');
            
            // 토큰 유효성 기본 검증
            if (!token || token.trim() === '' || token === 'null' || token === 'undefined') {
                console.error('Invalid token detected:', token);
                alert('로그인 실패: 유효하지 않은 토큰입니다.');
                window.location.replace('/app');
                return;
            }
            
            // API 호출 전 토큰을 직접 헤더에 지정 (인터셉터 충돌 방지)
            console.log('Making API call with direct Authorization header');
            
            client.get('/api/login/get-v3-user-info', {
                headers: {
                    'Authorization': token
                }
            })
            .then(function(response){
                console.log(response);
                sessionStorage.setItem('token', response.data.token)
                sessionStorage.setItem('userCode', response.data.user_code);
                sessionStorage.setItem('userId', response.data.user_id);
                sessionStorage.setItem('userBirth', response.data.user_birth);
                sessionStorage.setItem('userName', response.data.user_name);
                sessionStorage.setItem('userGender', response.data.user_gender);
                sessionStorage.setItem('userNickname', response.data.user_nickname);
                sessionStorage.setItem('marketingAgree', response.data.marketing_agree);
                sessionStorage.setItem('loginType', response.data.login_type);
                sessionStorage.setItem('userType', response.data.user_type);
                sessionStorage.setItem('userHeight', response.data.user_height);
                sessionStorage.setItem('userWeight', response.data.user_weight);
                sessionStorage.setItem('userPosition', response.data.user_position);
                sessionStorage.setItem('teamCode', response.data.team_code);

                if(response.data.user_type === '-1') { // 가입 후 첫 로그인시 팀 가입 유도 페이지로 이동
                    window.location.replace('/app/completesignup');
                } else {
                    navigate('/app/main');
                }
            })
            .catch(function(error){
                console.error('API Error:', error);
                console.error('Error response:', error.response);
                console.error('Request headers:', error.config?.headers);
                console.error('Request URL:', error.config?.url);
                
                let errorMessage = '로그인 실패: ';
                if (error.response?.status === 401) {
                    errorMessage += '인증 토큰이 유효하지 않습니다. 다시 로그인해주세요.';
                    // 토큰 관련 세션 정리
                    sessionStorage.clear();
                } else if (error.response?.status === 403) {
                    errorMessage += '접근 권한이 없습니다.';
                } else if (error.response?.status === 500) {
                    errorMessage += '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                } else {
                    errorMessage += (error.response?.data?.error || error.message);
                }
                
                alert(errorMessage);
                window.location.replace('/app');
            });
        }
    }

    return(
        <div style={{width: '100%', height:'100vh', display:'flex', flexDirection:'column', 
        alignItems:'center', justifyContent:'center'}}>
            <div style={{fontWeight: '700', fontSize: '5vh', position:'absolute'}}>AGROUNDS</div>
            <span style={{position:'absolute', bottom:'20vh'}} className="loader"></span>
        </div>
    )
};

export default LoadingPage;
