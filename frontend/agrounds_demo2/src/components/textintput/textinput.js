import React from 'react';
import './textinput.scss'
import classNames from 'classnames';
const textinput = ({placeholder, type, onChange, size}) => {
    return (
        <div className={classNames('inputbox', size)}>
            <input className='input'onChange={onChange} placeholder={placeholder} type={type}/>
        </div>
    );
};

export default textinput;