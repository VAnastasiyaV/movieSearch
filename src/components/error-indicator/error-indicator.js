import React from 'react';

import { Alert, Space } from 'antd';

import './error-indicator.css';
import icon from './error-icon.svg';

function ErrorIndicator() {
    return (

        <div className="error-indicator">
            <img className='icon' src={icon} alt="error icon" />
            <p className='oops'>OOPS!</p>
            <Space direction="vertical">
                <Alert message="somthing has gone wrong" type="error" />
            </Space>
        </div >
    )
}

export default ErrorIndicator;