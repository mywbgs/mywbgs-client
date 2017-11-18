import React from 'react';
import PropTypes from 'prop-types';

const componentName = props => {
    return (
        <div className={`Page Page--${props.name}`} style={props.background ? {backgroundColor: props.background} : {}}>
            {props.children}
        </div>
    );
};

componentName.propTypes = {
    name: PropTypes.string,
    background: PropTypes.string
};

export default componentName;