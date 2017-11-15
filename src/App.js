import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import store from './store';

import Home from './screens/Home';
import Login from './screens/Login';
import Homework from './screens/homework/Homework';
import HomeworkEdit from './screens/homework/HomeworkEdit';
import HomeworkView from './screens/homework/HomeworkView';
import Menu from './screens/Menu';
import Calendar from './screens/Calendar';
import Timetable from './screens/Timetable';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/homework" component={Homework}/>
                    <Route exact path="/homework/new" component={HomeworkEdit}/>
                    <Route exact path="/homework/:id/edit" component={HomeworkEdit}/>
                    <Route exact path="/homework/:id/view" component={HomeworkView}/>
                    <Route exact path="/menu" component={Menu}/>
                    <Route exact path="/calendar" component={Calendar}/>
                    <Route exact path="/timetable" component={Timetable}/>
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;