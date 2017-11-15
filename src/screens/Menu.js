import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as moment from 'moment';

import Page from '../components/Page';
import Header from '../components/Header';
import List, { ListItem } from '../components/List';
import Container from '../components/Container';
import LoadingSpinner from '../components/LoadingSpinner';

class Menu extends Component {
    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.replace('/login');
            return;
        }
    }

    render() {
        const items = this.props.menu.map((day, i) => {
        const options = day.map((option, optioni) => <ListItem key={i * this.props.menu.length + optioni} title={option.item}/>);
            const dayOfWeek = moment().isoWeekday(i + 1).format('dddd');
            return <List key={i} title={dayOfWeek} items={options}/>
        });

        const header = (
            <Header colour="#9C27B0" onBack={() => this.props.history.goBack()}>
                Menu
            </Header>
        );
        const spinner = (
            <Page name="menu">
                {header}
                <LoadingSpinner colour="#9C27B0"/>
            </Page>
        );
        const page = (
            <Page name="menu">
                {header}
                <Container vertical>
                    {items}
                </Container>
            </Page>
        );

        return this.props.loadingMenu ? spinner : page;
    }
}


export default connect(state => {
    const { menu, loadingMenu, authToken } = state.datastore;
    return {loggedIn: !!authToken, menu, loadingMenu};
})(withRouter(Menu));