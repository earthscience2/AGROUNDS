import React from 'react';
import TextInput from './textinput';
import './sign_up_input.scss';
const SignUpInput = ({title, type, onChange}) => {
    return (
        <div className='signupinput'>
            <div className='signupinput_title'>{title}</div>
            <TextInput onChange={onChange}size='medium'type={type}/>
        </div>
    );
};

export default SignUpInput;