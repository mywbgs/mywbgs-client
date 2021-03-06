import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';
import Helmet from 'react-helmet';

import Page from '../components/Page';
import Header from '../components/Header';
import Container from '../components/Container';
import DetailsTable from '../components/DetailsTable';
import LoadingSpinner from '../components/LoadingSpinner';

import { getShortRoom } from '../utils';
import {TIMETABLE_COLOUR} from '../consts';

class Timetable extends Component {
    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.replace('/login');
            return;
        }
    }

    shouldRenderPeriod = period => !(period.period === 5 && period.free)

    render() {
        const timetable = this.props.timetable.map((day, i) => {
            const periods = day.filter(this.shouldRenderPeriod);
            const labels = periods.map(period => {
                if(period.subject && period.teacher) {
                    return period.subject + ' · ' + period.teacher;
                } else if (period.subject) {
                    return period.subject;
                } else {
                    return 'Free period';
                }
            });
            const values = periods.map(period => getShortRoom(period.room));
            const dayOfWeek = moment().isoWeekday(i + 1).format('dddd');
            return (
                <div key={i}>
                    <p className="title">{dayOfWeek}</p>
                    <DetailsTable labels={values} values={labels}/>
                </div>
            )
        });

        const spinner = <LoadingSpinner colour={TIMETABLE_COLOUR}/>;
        const page = (
            <Container>
                {timetable}
            </Container>
        );

        return (
            <Page name="timetable">
                <Helmet><title>Timetable</title></Helmet>
                <Header colour={TIMETABLE_COLOUR} onBack={() => this.props.history.push('/')}>
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