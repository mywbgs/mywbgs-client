import React from 'react';
import PropTypes from 'prop-types';

const CheckCircle = props => {
    return (
        <div className={`CheckCircle ${props.checked ? `CheckCircle--checked` : ``}`} style={{backgroundColor: props.fg}} onClick={() => props.onCheckedChange(!props.checked)}>
            <div className="CheckCircle__inner" style={{backgroundColor: props.bg}}></div>
            <input type="checkbox" value={props.checked} onChange={() => props.onCheckedChange(!props.checked)}/>
        </div>
    );
};

CheckCircle.propTypes = {
    checked: PropTypes.bool,
    fg: PropTypes.string,
    bg: PropTypes.string,
    onCheckedChange: PropTypes.func
};

export default CheckCircle;