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
import withTracker from './components/withTracker';

const wrapper = component => withTracker(component);

const App = props => {
    const router = (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={wrapper(Home)}/>
                <Route exact path="/login" component={wrapper(Login)}/>
                <Route exact path="/homework" component={wrapper(Homework)}/>
                <Route exact path="/homework/new" component={wrapper(HomeworkEdit)}/>
                <Route exact path="/homework/:id/edit" component={wrapper(HomeworkEdit)}/>
                <Route exact path="/homework/:id/view" component={wrapper(HomeworkView)}/>
                <Route exact path="/canteen" component={wrapper(Menu)}/>
                <Route exact path="/calendar" component={wrapper(Calendar)}/>
                <Route exact path="/timetable" component={wrapper(Timetable)}/>
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