import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import * as moment from 'moment';

import Page from '../../components/Page';
import Container from '../../components/Container';
import Header from '../../components/Header';
import CheckCircle from '../../components/CheckCircle';
import DetailsTable from '../../components/DetailsTable';
import Spacer from '../../components/Spacer';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

import * as utils from '../../utils';
import * as actions from '../../actions';
import {HOMEWORK_COLOUR} from '../../consts';

class HomeworkView extends Component {
    viewHomework = () => this.props.history.push(`edit`);

    deleteHomework = () => {
        /* eslint-disable */
        if(!confirm(`Are you sure you want to delete "${this.props.homework.title}"`)) {
            return;
        } 
        this.props.deleteHomework(this.props.homework.id);
        this.props.history.replace('/homework');
    }
    
    checkProps = props => {
        if(!props.homework && !props.loading) {
            props.history.replace('/homework');
            return;
        }
    }
    
    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.replace('/login');
            return;
        }
        if(!this.props.homework && !this.props.loading) {
            this.props.history.replace('/homework');
            return;
        }
        console.log(this.props);
    }

    componentWillReceiveProps(newProps) {
        console.log(newProps);
        if(!newProps.homework && !newProps.loading) {
            this.props.history.replace('/homework');
            return;
        }
    }

    render() {
        const spinner = (
            <Page name="homeworkview">
                <Helmet><title>View homework</title></Helmet>
                <Header colour={HOMEWORK_COLOUR} onBack={() => this.props.history.push('/')}>
                    View Homework
                </Header>
                <LoadingSpinner colour={HOMEWORK_COLOUR}/>
            </Page>
        );
        const page = this.props.homework ? (
            <Page name="homeworkview">
                <Helmet><title>{this.props.lesson.subject} · {this.props.homework.title}</title></Helmet>
                <Header colour={HOMEWORK_COLOUR} onBack={() => this.props.history.push('/homework')}>
                    <div className="expand">
                        {this.props.homework.title}
                        <div className="Header__small">{this.props.lesson.subject}</div>
                    </div>
                    <div className="Header__Sidebar">
                        <CheckCircle checked={this.props.homework.completed} onCheckedChange={() => this.props.updateHomework(this.props.homework.id, {completed: !this.props.homework.completed})} fg="white" bg={HOMEWORK_COLOUR}/>
                    </div>
                </Header>
                <Container>
                    <DetailsTable labels={['Due', 'Teacher', 'Period', 'Created']} values={[moment(this.props.homework.due).format('Do MMMM'), this.props.lesson.teacher, utils.periodToOrdinal(this.props.homework.period + 1), moment(this.props.homework.createdAt).format('Do MMMM')]}/>
                    <p className="pre-wrap">{this.props.homework.notes}</p>
                    <Spacer vertical="8px"/>
                    <div className="ButtonGroup">
                        <Button onClick={this.viewHomework} bg={HOMEWORK_COLOUR} fg="white" icon="pencil">Edit</Button>
                        <Button onClick={this.deleteHomework} bg="#f6f6f6" fg="black" icon="trash">Delete</Button>
                    </div>
                </Container>
            </Page>
        ) : null;
        return !this.props.homework ? spinner : page;
    }
}

export default connect((state, ownProps) => {
    const { homework, timetable, authToken, loadingHomework, loadingTimetable } = state.datastore;
    const assignment = homework.find(x => x.id.toString() === ownProps.match.params.id);
    if(!assignment || loadingHomework || loadingTimetable) {
        return {loggedIn: !!authToken, homework: null, lesson: null, loading: loadingHomework || loadingTimetable};
    }
    const lesson = utils.getLesson(timetable, moment(assignment.due), assignment.period);
    return {loggedIn: !!authToken, homework: assignment, lesson, loading: false};
}, actions)(withRouter(HomeworkView));