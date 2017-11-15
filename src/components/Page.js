import React from 'react';
import PropTypes from 'prop-types';

const componentName = props => {
    return (
        <div className={`Page Page--${props.name}`}>
            {props.children}
        </div>
    );
};

componentName.propTypes = {
    name: PropTypes.string
};

export default componentName;