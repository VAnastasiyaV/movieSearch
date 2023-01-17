// import React from 'react';
// import PropTypes from 'prop-types';

import './short-string.css';

// eslint-disable-next-line import/prefer-default-export
const ShortString = (string, maxLength = 200, separator = ' ') => {
    if (string.length <= maxLength) return string;
    return `${string.substr(0, string.lastIndexOf(separator, maxLength))}...`;
}

export default ShortString;
