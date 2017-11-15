import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './Home.css';
import Page from '../components/Page';

const IndexSection = props => {
    return (
        <div
            className={`IndexSection ${props.small ? `IndexSection--small` : ``}`}
            onClick={props.onClick}
            style={{backgroundColor: props.colour}}>
            {props.title}
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
    
    render() {
        return (
            <Page name="index">
                <div className="IndexTitle">MyWBGS</div>
                <IndexSection title="Homework" colour="#C2185B" onClick={this.navigateTo('/homework')}/>
                <IndexSection title="Calendar" colour="#3F51B5" onClick={this.navigateTo('/calendar')}/>
                <IndexSection title="Menu" colour="#9C27B0" onClick={this.navigateTo('/menu')}/>
                <IndexSection title="Timetable" colour="#5E35B1" onClick={this.navigateTo('/timetable')}/>
                {/*<IndexSection title="Health and wellbeing" colour="#611B7E" onClick={navigateTo('/wellbeing', props.history)} small/>*/}
            </Page>
        );
    }
}

export default connect(state => {
    const { authToken } = state.datastore;
    return {loggedIn: !!authToken};
})(Home);