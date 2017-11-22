import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import * as moment from 'moment';

import Page from '../../components/Page';
import Header from '../../components/Header';
import List, { ListItem } from '../../components/List';
import Container from '../../components/Container';
import LoadingSpinner from '../../components/LoadingSpinner';

import * as utils from '../../utils';
import * as actions from '../../actions';
import {HOMEWORK_COLOUR} from '../../consts';

const addNew = history => () => {
    history.push('/homework/new');
};

const viewHomework = (homework, history) => () => {
    history.push(`/homework/${homework.id}/view`);
}

class Homework extends Component {
    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.replace('/login');
            return;
        }
    }

    getHwkTitleEl = (title, checked) => <div className="ListItemTitleChecked">{checked ? <FontAwesome name="circle" style={{color: HOMEWORK_COLOUR}}/> : <FontAwesome name="circle-thin"/>}{title}</div>

    render() {
        if(!this.props.loading) {
            const now = moment();
            const today = this.props.homework.filter(homework => moment(homework.due).isSame(now, 'day')).map(homework => {
                const subject = utils.getSubject(this.props.timetable, moment(homework.due), homework.period);
                return <ListItem key={homework.id} title={this.getHwkTitleEl(homework.title, homework.completed)} subtitle={subject.subject} onClick={viewHomework(homework, this.props.history)}/>
            });

            const tomorrowDate = now.add(1, 'day');
            const tomorrow = this.props.homework.filter(homework => moment(homework.due).isSame(tomorrowDate, 'day')).map(homework => {
                const subject = utils.getSubject(this.props.timetable, moment(homework.due), homework.period);
                return <ListItem key={homework.id} title={this.getHwkTitleEl(homework.title, homework.completed)} subtitle={subject.subject} onClick={viewHomework(homework, this.props.history)}/>
            });

            const later = this.props.homework.filter(homework => moment(homework.due).isAfter(tomorrowDate, 'day')).map(homework => {
                const subject = utils.getSubject(this.props.timetable, moment(homework.due), homework.period);
                return <ListItem key={homework.id} title={this.getHwkTitleEl(homework.title, homework.completed)} subtitle={subject.subject} onClick={viewHomework(homework, this.props.history)}/>
            });

            return (
                <Page name="homework">
                    <Header colour={HOMEWORK_COLOUR} onBack={() => this.props.history.goBack()}>
                        <div className="expand">Homework</div>
                        <div>
                            <FontAwesome name="plus" onClick={addNew(this.props.history)}/>
                        </div>
                    </Header>
                    <Container vertical>
                        {today.length > 0 ? <List title="Today" items={today} border/> : null}
                        {tomorrow.length > 0 ? <List title="Tomorrow" items={tomorrow} border/> : null}
                        {later.length > 0 ? <List title="Later" items={later} border/> : null}
                    </Container>
                </Page>
            );
        } else {
            return (
                <Page name="homework">
                    <Header colour={HOMEWORK_COLOUR} onBack={() => this.props.history.goBack()}>
                        Homework
                    </Header>
                    <LoadingSpinner colour={HOMEWORK_COLOUR}/>
                </Page>
            );
        }
    }
}

export default connect(state => {
    const { homework, timetable, authToken, loadingTimetable, loadingHomework } = state.datastore;
    return {loggedIn: !!authToken, homework: homework.filter(x => !!x), timetable, loading: loadingTimetable || loadingHomework};
}, actions)(withRouter(Homework));