import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';

import './Calendar.css';

import Page from '../components/Page';
import Container from '../components/Container';
import Header from '../components/Header';
import CalendarComponent from '../components/Calendar';
import List, { ListItem } from '../components/List';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

import * as actions from '../actions';
import * as utils from '../utils';

const onDateSelected = changeDate => date => changeDate(date);
const updateQuery = updateQuery => event => updateQuery(event.target.value);

class Calendar extends Component {
    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.replace('/login');
            return;
        }
    }

    render() {
        const selectedDate = this.props.selectedDate;
        const selectedDateStart = selectedDate.clone().startOf('day');
        const selectedDateEnd = selectedDate.clone().endOf('day');
        
        const events = utils.filterUntil(this.props.calendar, (event) => {
            const before = selectedDateStart.isSameOrBefore(moment(event.end));
            const after = selectedDateEnd.isSameOrAfter(moment(event.start));
            if(before && after) {
                return {match: true};
            } else if (selectedDateEnd.isBefore(moment(event.start))) {
                return {quit: true};
            } else {
                return {};
            }
        })
            .sort(utils.sortEvents)
            .map(event => <ListItem key={event.summary} title={event.summary} subtitle={utils.labelForDuration(moment(event.start), moment(event.end))}/>);
        
        let dateModal = null;
        if(this.props.modal) {
            const currentDate = moment();
            if(this.props.modal) {
                const months = [];
                for(let i = 0; i < 10; i++) {
                    months.push(currentDate.clone());
                    currentDate.add(1, 'month');
                }
                const items = months.map(month => <ListItem key={month.toString()} title={month.format('MMMM YYYY')} onClick={() => this.props.calendarChangeMonth(month)}/>)
                dateModal = <Modal onClose={() => this.props.calendarShowModal(false)}><List title="Months" items={items} border/></Modal>
            }
        }

        const spinner = (
            <Page name="calendar">
                <Header colour="#3F51B5" onBack={() => this.props.history.goBack()}>
                    Calendar
                </Header>
                <LoadingSpinner colour="#3F51B5"/>
            </Page>
        );
        const page = (
            <Page name="calendar">
                <div className="FauxHeader">
                    <Header colour="#3F51B5" onBack={() => this.props.history.goBack()} noshadow>
                        Calendar
                    </Header>
                    <Container>
                        <CalendarComponent
                            month={this.props.month.month()}
                            year={this.props.month.year()}
                            selectedDate={selectedDate}
                            colour="#3F51B5"
                            onDateSelected={onDateSelected(this.props.calendarChangeDate)}
                            onMonthClicked={() => this.props.calendarShowModal(true)}/>
                    <input type="text" placeholder="Search" value={this.props.query} onChange={updateQuery(this.props.calendarUpdateQuery)}/>
                    </Container>
                </div>
                <Container vertical>
                    <List title={selectedDate.format('Do MMMM YYYY')} border items={events}/>
                </Container>
                {dateModal}
            </Page>
        );

        return this.props.loadingCalendar ? spinner : page;
    }
}


export default connect(state => {
    const { selectedDate, query, month, modal } = state.calendar;
    const { calendar, loadingCalendar, authToken } = state.datastore;
    return {loggedIn: !!authToken, selectedDate, query, calendar, month, modal, loadingCalendar};
}, actions)(withRouter(Calendar));