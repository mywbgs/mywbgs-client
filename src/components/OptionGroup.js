import React from 'react';
import PropTypes from 'prop-types';

const OptionGroup = props => {
    let options = props.options
        .map((option, i) =>
            <p
                key={option}
                onClick={() => props.onSelected(i)}
                className={`Option ${(props.selected !== null && props.selected !== undefined) ? props.selected === i ? `Option--selected` : `Option--notselected` : ``}`}>
                    {option}
            </p>);
    
    return (
        <div className="OptionGroup">
            <p className="title">{props.title}</p>
            <div className="OptionGroup__options">
                {options}
            </div>
        </div>
    );
};

OptionGroup.propTypes = {
    title: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    selected: PropTypes.number,
    onSelected: PropTypes.func
};

export default OptionGroup;