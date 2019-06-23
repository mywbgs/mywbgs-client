import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

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

    update = e => window.location.reload(true);

    shouldShowMenu = () => {
        // if(this.props.loadingProfile) {
        //     return false;
        // } else if((this.props.profile && this.props.profile.form) ? (this.props.profile.form.startsWith('L6') || this.props.profile.form.startsWith('U6')) : true) {
        //     return false;
        // } else {
        //     return true;
        // }
        return true;
    }

    getStatus = () => {
        if(this.props.updateStatus === 'LOADING') {
            return <div className="FauxLink FauxLink--Secondary">Updating</div>;
        } else if(this.props.updateStatus === 'READY') {
            return <div className="FauxLink" onClick={this.update}>Update</div>;
        }
        return null;
    }
    
    render() {
        return (
            <Page name="index">
                <Helmet>MyWBGS</Helmet>
                <div className="IndexTitle"><span>MyWBGS</span><div className="FauxLink FauxLink--Secondary" onClick={this.logout}>Logout</div>{this.getStatus()}</div>
                <IndexSection title="Homework" colour={consts.HOMEWORK_COLOUR} onClick={this.navigateTo('/homework')}/>
                <IndexSection title="Calendar" colour={consts.CALENDAR_COLOUR} onClick={this.navigateTo('/calendar')}/>
                <IndexSection title="Timetable" colour={consts.TIMETABLE_COLOUR} onClick={this.navigateTo('/timetable')}/>
                {/* {this.shouldShowMenu() ? <IndexSection title="Canteen" colour={consts.MENU_COLOUR} onClick={this.navigateTo('/canteen')}/> : null} */}
            </Page>
        );
    }
}

export default connect(state => {
    const { updateStatus } = state;
    const { authToken, profile, loadingProfile } = state.datastore;
    return {loggedIn: !!authToken, profile, loadingProfile, updateStatus};
}, actions)(Home);
