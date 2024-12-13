import { useEffect } from 'react';
import './loading.scss'
import client from '../../client';

const LoadingPage = () => {
    const token = new URL(window.location.href).searchParams.get('code');

    // 카카오 로그인 시 token이 url parameter로 들어오는지 검사하고,
    // 들어오고 있으면 token을 api에 전송하여 유저 정보 불러옴
    useEffect(()=>{
        if (token === '0'){
            window.location.replace(process.env.REACT_APP_BASE_URL+"/api/login/kakao");
        } else {
            setTimeout(loader, 1000 * 1);
        }
    },[])

    function loader() {
        if(token === null){
            console.log('token is not comming');
            alert('카카오 로그인 실퍠 : 토큰이 null 입니다.');
            window.location.replace('/');
        } else {
            console.log('token : ' + token);
            client.defaults.headers.common['Authorization'] = token;
            client.get('/api/login/get-user-info')
            .then(function(response){
                console.log(response);
                sessionStorage.setItem('token', response.data.token)
                sessionStorage.setItem('userCode', response.data.user_code);
                sessionStorage.setItem('userId', response.data.user_id);
                sessionStorage.setItem('userCode', response.data.user_code);
                sessionStorage.setItem('userBirth', response.data.user_birth);
                sessionStorage.setItem('userName', response.data.user_name);
                sessionStorage.setItem('userGender', response.data.user_gender);
                sessionStorage.setItem('loginType', response.data.login_type);
                sessionStorage.setItem('userType', response.data.user_type);
                sessionStorage.setItem('userHeight', response.data.user_Height);
                sessionStorage.setItem('userWeight', response.data.user_Weight);
                sessionStorage.setItem('userPosition', response.data.user_position);
                sessionStorage.setItem('userNickname', response.data.user_nickname);
                sessionStorage.setItem('teamCode', response.data.team_code);
                sessionStorage.setItem('teamName', response.data.team_name);
                window.location.replace('/main');
            })
            .catch(function(error){
                alert('로그인 실패');
                window.location.replace('/');
                console.log(error);
            });
        }
    }

    return(
        <div style={{width: '100vw', height:'100vh', display:'flex', flexDirection:'column', 
        alignItems:'center', justifyContent:'center'}}>
            <div style={{fontWeight: '700', fontSize: '5vh', position:'absolute'}}>AGROUNDS</div>
            <span style={{position:'absolute', bottom:'20vh'}} className="loader"></span>
        </div>
    )
};

export default LoadingPage