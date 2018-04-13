import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import * as moment from 'moment';

const createNonStandarDay = date => ({standard: false, date});
const createStandardDay = date => ({standard: true, date});

const generateCalendar = (month, year) => {
    const daysInMonth = moment({month, year}).daysInMonth();
    const firstDayOfMonth = moment({month, year, day: 1});
    const firstDayIndex = firstDayOfMonth.isoWeekday() - 1;
    const weeksInMonth = Math.ceil((daysInMonth + firstDayIndex) / 7);

    let rows = [];
    for(let week = 0; week < weeksInMonth; week ++) {
        rows[week] = [];
        for(let index = 0; index < 7; index++) {
            let day = (week * 7) + (index + 1) - firstDayIndex - 1;

            if(day < 0) {
                rows[week].push(createNonStandarDay(firstDayOfMonth.clone().add(day, 'days')));
            } else if(day >= daysInMonth) {
                rows[week].push(createNonStandarDay(firstDayOfMonth.clone().add(1, 'month').add(day - daysInMonth , 'days')));
            } else {
                rows[week].push(createStandardDay(firstDayOfMonth.clone().add(day, 'days')));
            }
        }
    }
    return rows;
}

const Calendar = props => {
    const month = (props.month === null || props.month === undefined) ? moment().month() : props.month;
    const year = (props.year === null || props.year === undefined) ? moment().year() : props.year;
    const calendar = generateCalendar(month, year);
    const rows = calendar.map((row, rowi) => (
        <tr key={rowi}>{row.map((cell, celli) => (
            <td key={rowi * calendar.length + celli} className={!cell.standard ? `Day--filler` : ``} onClick={() => props.onDateSelected(cell.date)}>
                <div
                    className={`Day__highlight ${cell.date.isSame(props.selectedDate, 'day') ? `Day__highlight--selected` : ``}`}
                    style={{color: cell.date.isSame(props.selectedDate, 'day') ? props.colour : 'white'}}>
                        {cell.date.date()}
                </div>
            </td>))}
        </tr>));
    return (
        <div className="Calendar">
            <p className="title" onClick={props.onMonthClicked}>{moment.months()[month]} {year}&nbsp;&nbsp;<FontAwesome name="angle-down"/></p>
            <table>
                <thead>
                    <tr>
                        <td><div className="Day__highlight">M</div></td>
                        <td><div className="Day__highlight">T</div></td>
                        <td><div className="Day__highlight">W</div></td>
                        <td><div className="Day__highlight">T</div></td>
                        <td><div className="Day__highlight">F</div></td>
                        <td><div className="Day__highlight">S</div></td>
                        <td><div className="Day__highlight">S</div></td>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
};

Calendar.propTypes = {
    month: PropTypes.number,
    year: PropTypes.number,
    selectedDate: PropTypes.object,
    colour: PropTypes.string,
    onDateSelected: PropTypes.func,
    onMonthClicked: PropTypes.func,
};

export default Calendar;