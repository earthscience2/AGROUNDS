import { useEffect } from 'react';
import client from '../../clients';
import './loading.scss'

const LoadingPage = () => {
    const token = new URL(window.location.href).searchParams.get('code');

    // 카카오 로그인 시 token이 url parameter로 들어오는지 검사하고,
    // 들어오고 있으면 token을 api에 전송하여 유저 정보 불러옴
    useEffect(()=>{
        if (token === '0'){
            window.location.replace(process.env.REACT_APP_BASE_URL+"/api/V2login/kakao");
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
            client.get('/api/V2login/get-user-info')
            .then(function(response){
                console.log(response);
                sessionStorage.setItem('nickname', response.data.user_nickname);
                sessionStorage.setItem('token', response.data.token)
                sessionStorage.setItem('usercode', response.data.user_code);
                sessionStorage.setItem('usertype', response.data.user_type);
                sessionStorage.setItem('teamcode', response.data.team_code);
                sessionStorage.setItem('teamname', response.data.team_name);
                if (sessionStorage.getItem('usertype') === '-1'){
                    window.location.replace('/FirstSignup');
                }else{
                    window.location.replace('/MainPage');
                }
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