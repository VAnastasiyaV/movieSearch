import React from 'react';

import './spinner.css';

function Spinner() {

    const s = [];
    for (let i = 51; i < 63; i++) {
        s.push(<div key={i} />)
    }

    return (

        <div className="loadingio-spinner-spinner-qan82fuqp6">
            <div className="ldio-vw47hwmc49k">
                {s.map((item) => item)}
            </div>
        </div>
    )
}

export default Spinner;