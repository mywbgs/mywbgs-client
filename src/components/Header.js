import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

const Header = props => {
    return (
        <header className={`bold ${props.noshadow ? `Header--noshadow` : ``}`} style={{backgroundColor: props.colour}}>
            <div className="Header__icon" onClick={props.onBack}><FontAwesome name="arrow-left"/></div>
            {props.children}
        </header>
    );
};

Header.propTypes = {
    colour: PropTypes.string,
    noshadow: PropTypes.bool,
    onBack: PropTypes.func
};

export default Header;