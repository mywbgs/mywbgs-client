import React from 'react';
import PropTypes from 'prop-types';

const Container = props => {
    return (
        <div className={`Container ${props.horizontal ? `Container--horizontal` : ``} ${props.vertical ? `Container--vertical` : ``}`}>
            {props.children}
        </div>
    );
};

Container.propTypes = {
    horizontal: PropTypes.bool,
    vertical: PropTypes.bool,
    invisible: PropTypes.bool
};

export default Container;