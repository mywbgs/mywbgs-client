import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import Helmet from 'react-helmet';
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

    getHwkTitleEl = homework => {
        const onClick = e => {
            this.props.updateHomework(homework.id, {completed: !homework.completed});
            e.stopPropagation();
        };
        return (
            <div className="ListItemTitleChecked">
                {homework.completed ? <FontAwesome name="circle" style={{color: HOMEWORK_COLOUR}} onClick={onClick}/> : <FontAwesome name="circle-thin" onClick={onClick}/>}
                {homework.title}
            </div>
        );
    }

    getHomeworkGroup = list => list.map(homework => {
        const lesson = utils.getLesson(this.props.timetable, moment(homework.due), homework.period);
        return <ListItem key={homework.id} title={this.getHwkTitleEl(homework)} subtitle={`${lesson.subject} · ${lesson.teacher}`} onClick={viewHomework(homework, this.props.history)}/>
    });

    getFriendlyTitle = date => {
        const startOfDay = moment().startOf('day');
        if(date.isSame(startOfDay, 'day')) {
            return 'Today';
        } else if (date.isSame(startOfDay.clone().add(1, 'day'), 'day')) {
            return 'Tomorrow';
        } else {
            return date.format('dddd Do MMMM');
        }
    }

    render() {
        if(!this.props.loading) {
            const startOfDay = moment().startOf('day');
            const groupedHomework = {};
            this.props.homework.forEach(homework => {
                const diff = moment(homework.due).diff(startOfDay, 'days');
                if(diff < 0) return;
                if(groupedHomework[diff]) {
                    groupedHomework[diff].push(homework);
                } else {
                    groupedHomework[diff] = [homework];
                }
            });

            const sections = Object.keys(groupedHomework).map(key => {
                const date = startOfDay.clone().add(key, 'days');
                const title = this.getFriendlyTitle(date);
                const homeworks = groupedHomework[key].sort((a, b) => a.period - b.period);
                const items = this.getHomeworkGroup(homeworks);
                return <List key={key} title={title} items={items} border/>;
            });

            return (
                <Page name="homework">
                    <Helmet><title>Homework</title></Helmet>
                    <Header colour={HOMEWORK_COLOUR} onBack={() => this.props.history.push('/')}>
                        <div className="expand">Homework</div>
                        <div>
                            <FontAwesome name="plus" onClick={addNew(this.props.history)}/>
                        </div>
                    </Header>
                    <Container vertical>
                        {sections}
                    </Container>
                </Page>
            );
        } else {
            return (
                <Page name="homework">
                    <Helmet><title>Homework</title></Helmet>
                    <Header colour={HOMEWORK_COLOUR} onBack={() => this.props.history.push('/')}>
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