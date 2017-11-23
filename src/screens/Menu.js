import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as moment from 'moment';

import Page from '../components/Page';
import Header from '../components/Header';
import List, { ListItem } from '../components/List';
import Container from '../components/Container';
import LoadingSpinner from '../components/LoadingSpinner';

import {MENU_COLOUR} from '../consts';

class Menu extends Component {
    componentWillMount() {
        if(!this.props.loggedIn) {
            this.props.history.replace('/login');
            return;
        }
    }

    render() {
        const items = this.props.menu.map((day, dayi) => {
            const title = moment().isoWeekday(dayi + 1).format('dddd');
            const options = [
                <ListItem key={'main' + dayi} title={day.main}/>,
                <ListItem key={'veggie' + dayi} title={day.veggie}/>,
                <ListItem key={'sides' + dayi} title={day.sides}/>,
                <ListItem key={'dessert' + dayi} title={day.dessert}/>,
            ]
            return <List key={'day' + dayi} title={title} items={options}/>;
        });

        const header = (
            <Header colour={MENU_COLOUR} onBack={() => this.props.history.goBack()}>
                Menu
            </Header>
        );
        const spinner = (
            <Page name="menu">
                {header}
                <LoadingSpinner colour={MENU_COLOUR}/>
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