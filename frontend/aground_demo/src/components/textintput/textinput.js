import React from 'react';
import './textinput.scss'
const textinput = ({placeholder, type, onChange}) => {
    return (
        <div className='inputbox'>
            <input className='input' onChange={onChange} placeholder={placeholder} type={type}/>
        </div>
    );
};

export default textinput;