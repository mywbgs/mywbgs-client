import React from 'react';
import PropTypes from 'prop-types';

const Spacer = props => {
    return (
        <div style={{paddingTop: props.vertical, paddingLeft: props.horizontal}}>{props.children}</div>
    );
};

Spacer.propTypes = {
    vertical: PropTypes.string,
    horizontal: PropTypes.string
};

export default Spacer;