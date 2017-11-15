import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import './Login.css';
import Page from '../components/Page';
import Container from '../components/Container';

import * as actions from '../actions';

class Login extends Component {
    componentWillReceiveProps(newProps) {
        if(newProps.authToken) {
            // Login successful
            this.props.downloadAll();
            this.props.history.replace('/');
        }
    }

    submit = e => {
        e.preventDefault();
        if(this.props.working) {
            return;
        }
        this.props.login(this.props.username, this.props.password);
    };

    update = (field, updateAction) => event => updateAction(field, event.target.value);

    render() {
        const buttonDisabled = this.props.username.trim().length === 0 || this.props.password.length === 0;
        return (
            <Page name="login">
                <Container>
                    <form onSubmit={this.submit}>
                        <span className="Logo">MyWBGS</span>
                        <input type="text" placeholder="Username" value={this.props.username} onChange={this.update('username', this.props.loginUpdateField)}/>
                        <input type="password" placeholder="Password" value={this.props.password} onChange={this.update('password', this.props.loginUpdateField)}/>
                        <button disabled={buttonDisabled}>
                            <div style={{display: !this.props.working ? 'block' : 'none'}}>Login</div>
                            <div style={{display: this.props.working ? 'block' : 'none'}}><FontAwesome name="circle-o-notch" spin/></div>
                        </button>
                        <p className="LoginHelp" style={{visibility: this.props.error ? 'visible' : 'hidden'}}>{this.props.error || 'Placeholder'}</p>
                    </form>
                </Container>
            </Page>
        );
    }
}

export default connect(state => {
    const { username, password, working, error } = state.login;
    const { authToken } = state.datastore;
    return {username, password, working, error, authToken};
}, actions)(withRouter(Login));