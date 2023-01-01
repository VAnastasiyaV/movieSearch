import React from 'react';
import { Tabs } from 'antd';
import PropsTypes from 'prop-types'

import './header.css';

function Header({ changeTabs, tabPane }) {
    return (
        <Tabs
            defaultActiveKey="1"
            activeKey={tabPane}
            onChange={changeTabs}
            items={[
                {
                    label: `Search`,
                    key: '1',
                },
                {
                    label: `Rated`,
                    key: '2',
                }
            ]}
        />
    )
}

Header.defaultProps = {
    changeTabs: () => { },
    tabPane: 1,
}

Header.propsTypes = {
    changeTabs: PropsTypes.func,
    tabPane: PropsTypes.number
}

export default Header;
