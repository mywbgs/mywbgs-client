import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as Fuse from 'fuse.js';

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
import {CALENDAR_COLOUR} from '../consts';

const onDateSelected = changeDate => date => changeDate(date);
const updateQuery = updateQuery => event => updateQuery(event.target.value);

class Calendar extends Component {
    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.replace('/login');
            return;
        }
        if(!this.props.loadingCalendar) {
            this.createFuse(this.props.calendar);
        }
    }
    
    componentWillReceiveProps(newProps) {
        if(this.props.loadingCalendar && !newProps.loadingCalendar) {
            this.createFuse(newProps.calendar);
        }
    }

    createFuse(events) {
        this.fuse = new Fuse(events, {
            shouldSort: true,
            tokenize: true,
            threshold: 0.2,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "summary"
            ]
        });
    }

    render() {
        const selectedDate = this.props.selectedDate;
        const selectedDateStart = selectedDate.clone().startOf('day');
        const selectedDateEnd = selectedDate.clone().add(1, 'day').startOf('day');
        
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

        let contents = null;
        if(this.props.query.trim() === '') {
            const events = utils.filterUntil(this.props.calendar, (event) => {
                const before = selectedDateStart.isBefore(moment(event.end));
                const after = selectedDateEnd.isAfter(moment(event.start));
                if(before && after) {
                    return {match: true};
                } else if (selectedDateEnd.isBefore(moment(event.start))) {
                    return {quit: true};
                } else {
                    return {};
                }
            })
                .sort(utils.sortEvents)
                .map(event => <ListItem key={event.id} title={event.summary} subtitle={utils.labelForDuration(moment(event.start), moment(event.end))}/>);

            contents = <List title={selectedDate.format('Do MMMM YYYY')} border items={events}/>;
        } else {
            const query = this.props.query.trim().toLowerCase();
            const events = this.fuse.search(this.props.query)
                .map(event => <ListItem key={event.id} title={event.summary} subtitle={utils.labelForDurationLong(moment(event.start), moment(event.end))}/>);
            contents = <List title="Search results" border items={events}/>;
        }

        const spinner = (
            <Page name="calendar">
                <Header colour={CALENDAR_COLOUR} onBack={() => this.props.history.goBack()}>
                    Calendar
                </Header>
                <LoadingSpinner colour={CALENDAR_COLOUR}/>
            </Page>
        );
        const page = (
            <Page name="calendar">
                <div className="FauxHeader" style={{backgroundColor: CALENDAR_COLOUR}}>
                    <Header colour={CALENDAR_COLOUR} onBack={() => this.props.history.goBack()} noshadow>
                        Calendar
                    </Header>
                    <Container>
                        <div className="CalendarSlots">
                            <CalendarComponent
                                month={this.props.month.month()}
                                year={this.props.month.year()}
                                selectedDate={selectedDate}
                                colour={CALENDAR_COLOUR}
                                onDateSelected={onDateSelected(this.props.calendarChangeDate)}
                                onMonthClicked={() => this.props.calendarShowModal(true)}/>
                            <CalendarComponent
                                month={(this.props.month.month() + 1) % 12}
                                year={this.props.month.year() + (this.props.month.month() + 1 <= 11 ? 0 : 1)}
                                selectedDate={selectedDate}
                                colour={CALENDAR_COLOUR}
                                onDateSelected={onDateSelected(this.props.calendarChangeDate)}
                                onMonthClicked={() => this.props.calendarShowModal(true)}/>
                        </div>
                    <input type="text" placeholder="Search" value={this.props.query} onChange={updateQuery(this.props.calendarUpdateQuery)}/>
                    </Container>
                </div>
                <Container vertical>
                    {contents}
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
    return {loggedIn: !!authToken, selectedDate, query, calendar: calendar.map((event, i) => ({...event, id: i})), month, modal, loadingCalendar};
}, actions)(withRouter(Calendar));