import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

const Button = props => {
    const icon = props.icon ? <FontAwesome name={props.icon}/> : null;
    return (
        <button style={{backgroundColor: props.bg || 'white', color: props.fg || 'black'}} onClick={props.onClick}>{icon} {props.children}</button>
    );
};

Button.propTypes = {
    icon: PropTypes.string,
    bg: PropTypes.string,
    fg: PropTypes.string,
    onClick: PropTypes.func
};

export default Button;