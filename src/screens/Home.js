import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './Home.css';
import Page from '../components/Page';

import * as actions from '../actions';
import * as consts from '../consts';

const IndexSection = props => {
    return (
        <div
            className={`IndexSection ${props.small ? `IndexSection--small` : ``}`}
            onClick={props.onClick}
            style={{backgroundColor: props.colour}}>
            <div className="IndexSectionContent">
                {props.title}
            </div>
        </div>
    );
};

IndexSection.propTypes = {
    title: PropTypes.string,
    colour: PropTypes.string,
    small: PropTypes.bool,
    onClick: PropTypes.func
};

class Home extends Component {
    navigateTo = route => () => this.props.history.push(route);

    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.push('/login');
            return;
        }
    }

    logout = e => {
        e.preventDefault();
        this.props.logout();
        this.props.history.push('/login');
        return;
    }
    
    render() {
        return (
            <Page name="index">
                <div className="IndexTitle"><span>MyWBGS</span><a href="#" onClick={this.logout}>Logout</a></div>
                <IndexSection title="Homework" colour={consts.HOMEWORK_COLOUR} onClick={this.navigateTo('/homework')}/>
                <IndexSection title="Calendar" colour={consts.CALENDAR_COLOUR} onClick={this.navigateTo('/calendar')}/>
                {/* <IndexSection title="Menu" colour="#9C27B0" onClick={this.navigateTo('/menu')}/> */}
                <IndexSection title="Timetable" colour={consts.TIMETABLE_COLOUR} onClick={this.navigateTo('/timetable')}/>
                {/*<IndexSection title="Health and wellbeing" colour="#611B7E" onClick={navigateTo('/wellbeing', props.history)} small/>*/}
            </Page>
        );
    }
}

export default connect(state => {
    const { authToken } = state.datastore;
    return {loggedIn: !!authToken};
}, actions)(Home);