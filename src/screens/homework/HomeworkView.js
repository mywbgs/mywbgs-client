import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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

class HomeworkView extends Component {
    viewHomework = () => this.props.history.push(`/homework/${this.props.homework._id}/edit`);

    deleteHomework = () => {
        this.props.deleteHomework(this.props.homework._id);
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
    }

    componentWillReceiveProps(newProps) {
        if(!newProps.homework && !newProps.loading) {
            this.props.history.replace('/homework');
            return;
        }
    }

    render() {
        const spinner = (
            <Page name="homeworkview">
                <Header colour="#C2185B" onBack={() => this.props.history.goBack()}>
                    View Homework
                </Header>
                <LoadingSpinner colour="#C2185B"/>
            </Page>
        );
        const page = !this.props.loading ? (
            <Page name="homeworkview">
                <Header colour="#C2185B" onBack={() => this.props.history.goBack()}>
                    <div className="expand">
                        {this.props.homework.title}
                        <div className="Header__small">{this.props.subject.subject}</div>
                    </div>
                    <div className="Header__Sidebar">
                        <CheckCircle checked={this.props.homework.completed} onCheckedChange={() => this.props.updateHomework(this.props.homework._id, {completed: !this.props.homework.completed})} fg="white" bg="#C2185B"/>
                    </div>
                </Header>
                <Container>
                    <DetailsTable labels={['Due', 'Period']} values={[moment(this.props.homework.due).format('Do MMMM'), utils.periodToOrdinal(this.props.homework.period + 1)]}/>
                    <Spacer vertical="8px"/>
                    <p className="pre-wrap">{this.props.homework.notes}</p>
                    <Spacer vertical="8px"/>
                    <div className="ButtonGroup">
                        <Button onClick={this.viewHomework} bg="#C2185B" fg="white" icon="pencil">Edit</Button>
                        <Button onClick={this.deleteHomework} bg="#f6f6f6" fg="black" icon="trash">Delete</Button>
                    </div>
                </Container>
            </Page>
        ) : null;
        return this.props.loading ? spinner : page;
    }
}

export default connect((state, ownProps) => {
    const { homework, timetable, authToken, loadingHomework, loadingTimetable } = state.datastore;
    const assignment = homework.find(x => x._id === ownProps.match.params.id);
    if(!assignment || loadingHomework || loadingTimetable) {
        return {loggedIn: !!authToken, homework: null, subject: null, loading: loadingHomework || loadingTimetable};
    }
    const subject = utils.getSubject(timetable, moment(assignment.due), assignment.period);
    return {loggedIn: !!authToken, homework: assignment, subject, loading: false};
}, actions)(withRouter(HomeworkView));