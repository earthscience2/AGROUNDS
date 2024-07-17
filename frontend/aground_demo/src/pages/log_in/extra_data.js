import React, { useState } from 'react';
import './extra_data.scss';
import SignUpInput from '../../components/textintput/sign_up_input';
import GeneralBtn from '../../components/button/generalBtn';
import client from '../../clients';
import { useNavigate } from 'react-router-dom';
const ExtraData = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [position, setPosition] = useState('');
    const navigate = useNavigate();
    const isValid = weight && height && position;
    const data = {
        'user_code': sessionStorage.getItem('usercode'),
        'user_weight': weight,
        'user_height': height,
        'user_position': position
    }
    const clickHandler = () => {
        if(isValid){
            client.post('/api/V2team/heWeight/', data)
            .then(function(response){
                alert('추가정보가 성공적으로 입력되었습니다.');
                sessionStorage.setItem('user_weight',weight);
                sessionStorage.setItem('user_height',height);
                sessionStorage.setItem('user_position',position);
                console.log(response)
                navigate('/FirstSignup')
            })
            .catch(function(error){
                console.log(error)
            })
        }else{
            alert('모든 필드를 입력해주세요.')
        }
    }
    return (
        <div className='extra_background'>
            <div className='extra_title'>추가정보 입력</div>
            <SignUpInput title='몸무게'onChange={(e) => setWeight(e.target.value)} placeholder='숫자만 입력해주세요.' type='number'/>
            <SignUpInput title='키'onChange={(e) => setHeight(e.target.value)} placeholder='숫자만 입력해주세요. ' type='number'/>
            <SignUpInput title='선호 포지션'onChange={(e) => setPosition(e.target.value)} placeholder='ex. CM, ST, RW' type='text'/>
                
            <div className='extra_button'>
                <GeneralBtn color='black' onClick={clickHandler} children='입력하기'/> 
            </div>
        </div>
    );
};

export default ExtraData;