import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

const LoadingSpinner = props => {
    return (
        <div className="LoadingSpinner">
            <FontAwesome
                style={{color: props.colour}}
                name="circle-o-notch"
                size="3x"
                spin/>
        </div>
    );
};

LoadingSpinner.propTypes = {
    colour: PropTypes.string
};

export default LoadingSpinner;