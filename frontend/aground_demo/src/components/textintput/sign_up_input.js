import React from 'react';
import TextInput from './textinput';
import './sign_up_input.scss';
const SignUpInput = ({title, type, onChange,placeholder}) => {
    return (
        <div className='signupinput'>
            <div className='signupinput_title'>{title}</div>
            <TextInput onChange={onChange} placeholder={placeholder} size='medium'type={type}/>
        </div>
    );
};

export default SignUpInput;