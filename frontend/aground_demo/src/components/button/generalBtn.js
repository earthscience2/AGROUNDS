import React from 'react';
import classNames from 'classnames'
import './generalBtn.scss';
const generalBtn = ({children, color, ...rest}) => {
    return (
        <div className={classNames('button',color)} {...rest}  >
            {children}
        </div>
    );
};

export default generalBtn;