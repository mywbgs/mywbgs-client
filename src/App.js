import React from 'react';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './screens/Home';
import Login from './screens/Login';
import Homework from './screens/homework/Homework';
import HomeworkEdit from './screens/homework/HomeworkEdit';
import HomeworkView from './screens/homework/HomeworkView';
import Menu from './screens/Menu';
import Calendar from './screens/Calendar';
import Timetable from './screens/Timetable';
import withTracker from './withTracker';

const App = props => {
    const router = (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={withTracker(Home)}/>
                <Route exact path="/login" component={withTracker(Login)}/>
                <Route exact path="/homework" component={withTracker(Homework)}/>
                <Route exact path="/homework/new" component={withTracker(HomeworkEdit)}/>
                <Route exact path="/homework/:id/edit" component={withTracker(HomeworkEdit)}/>
                <Route exact path="/homework/:id/view" component={withTracker(HomeworkView)}/>
                <Route exact path="/menu" component={withTracker(Menu)}/>
                <Route exact path="/calendar" component={withTracker(Calendar)}/>
                <Route exact path="/timetable" component={withTracker(Timetable)}/>
            </Switch>
        </BrowserRouter>
    );
    return (
        <Provider store={props.store}>
            {props.hydrated ? router : <div></div>}
        </Provider>
    );
};

export default connect(state => {
    const { hydrated } = state.datastore;
    return { hydrated };
})(App);