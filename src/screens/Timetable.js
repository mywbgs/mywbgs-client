import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';

import Page from '../components/Page';
import Header from '../components/Header';
import Container from '../components/Container';
import DetailsTable from '../components/DetailsTable';
import LoadingSpinner from '../components/LoadingSpinner';

class Timetable extends Component {
    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.replace('/login');
            return;
        }
    }

    render() {
        const timetable = this.props.timetable.map((day, i) => {
            const labels = day.map(period => period.subject);
            const values = day.map(period => period.room);
            const dayOfWeek = moment().isoWeekday(i + 1).format('dddd');
            return (
                <div key={i}>
                    <p className="title">{dayOfWeek}</p>
                    <DetailsTable labels={labels} values={values}/>
                </div>
            )
        });

        const spinner = <LoadingSpinner colour="#5E35B1"/>;
        const page = (
            <Container>
                {timetable}
            </Container>
        );

        return (
            <Page name="timetable">
                <Header colour="#5E35B1" onBack={() => this.props.history.goBack()}>
                    Timetable
                </Header>
                {this.props.loadingTimetable ? spinner : page}
            </Page>
        );
    }
}


export default connect(state => {
    const { timetable, loadingTimetable, authToken } = state.datastore;
    return {loggedIn: !!authToken, timetable, loadingTimetable};
})(withRouter(Timetable));