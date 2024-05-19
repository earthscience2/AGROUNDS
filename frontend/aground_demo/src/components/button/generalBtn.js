import React from 'react';
import classNames from 'classnames'
import './generalBtn.scss';
const generalBtn = ({children, color, ...rest}) => {
    return (
        <div className={classNames('button',color)}>
            <div className='text' {...rest}>{children}</div>
        </div>
    );
};

export default generalBtn;