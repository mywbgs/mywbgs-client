import React from 'react';
import PropTypes from 'prop-types';

const ListItem = props => {
    const title = props.title ? <p className="ListItem__title">{props.title}</p> : null;
    const subtitle = props.subtitle ? <p className="ListItem__subtitle">{props.subtitle}</p> : null;
    return (
        <div className={`ListItem ${props.row ? `ListItem--row` : ``}`} onClick={props.onClick}>
            {title}
            {subtitle}
        </div>
    );
};

ListItem.propTypes = {
    title: PropTypes.any,
    subtitle: PropTypes.string,
    row: PropTypes.bool,
    onClick: PropTypes.func
};

const List = props => {
    const title = props.title ? <div className="List__title">{props.title}</div> : null;
    return (
        <div className={`List ${props.border ? `List--border` : ``}`}>
            {title}
            {props.items}
        </div>
    );
};

List.propTypes = {
    border: PropTypes.bool,
    items: PropTypes.arrayOf(ListItem),
    title: PropTypes.string
};

export {ListItem};
export default List;