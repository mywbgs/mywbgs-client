import React from 'react';
import PropTypes from 'prop-types';

const DetailsTable = props => {
    const rows = props.labels.map((labelText, i) => {
        const label = <td className="DetailsTable__label">{labelText}</td>
        const value = <td className="DetailsTable__value">{props.values[i] || ''}</td>
        return <tr key={i}>{label}{value}</tr>;
    });
    return (
        <table className="DetailsTable">
            <tbody>
                {rows}
            </tbody>
        </table>
    );
};

DetailsTable.propTypes = {
    labels: PropTypes.arrayOf(PropTypes.string),
    values: PropTypes.arrayOf(PropTypes.string)
};

export default DetailsTable;