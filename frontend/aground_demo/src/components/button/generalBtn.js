import React from 'react';
import classNames from 'classnames'
import './generalBtn.scss';
const generalBtn = ({children, color, type, ...rest}) => {
    return (
        <button className={classNames('button',color)} type={type} {...rest}  >
            {children}
        </button>
    );
};

export default generalBtn;