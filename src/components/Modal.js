import React from 'react';
import PropTypes from 'prop-types';

const Modal = props => {
    return (
        <div className="Modal" onClick={props.onClose}>
            <div className="Modal__content">
                {props.children}
            </div>
        </div>
    );
};

Modal.propTypes = {
    onClose: PropTypes.func
}

export default Modal;