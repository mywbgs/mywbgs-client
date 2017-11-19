import React from 'react';
import { Provider, connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './screens/Home';
import Login from './screens/Login';
import Homework from './screens/homework/Homework';
import HomeworkEdit from './screens/homework/HomeworkEdit';
import HomeworkView from './screens/homework/HomeworkView';
// import Menu from './screens/Menu';
import Calendar from './screens/Calendar';
import Timetable from './screens/Timetable';

const App = props => {
    const router = (
        <Router>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/homework" component={Homework}/>
                <Route exact path="/homework/new" component={HomeworkEdit}/>
                <Route exact path="/homework/:id/edit" component={HomeworkEdit}/>
                <Route exact path="/homework/:id/view" component={HomeworkView}/>
                {/* <Route exact path="/menu" component={Menu}/> */}
                <Route exact path="/calendar" component={Calendar}/>
                <Route exact path="/timetable" component={Timetable}/>
            </Switch>
        </Router>
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