import React from 'react';
import TextInput from './textinput';
import './sign_up_input.scss';
const SignUpInput = ({title,dataPlaceholder,type, onChange,placeholder}) => {
    return (
        <div className='signupinput'>
            <div className='signupinput_title'>{title}</div>
            <TextInput data-placeholder={dataPlaceholder}onChange={onChange} placeholder={placeholder} size='medium'type={type}/>
        </div>
    );
};

export default SignUpInput;