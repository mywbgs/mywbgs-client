import { handleActions } from 'redux-actions';
import * as moment from 'moment';

import datastore from './datastore';
import homeworkEdit from './homeworkedit';

import * as actions from '../actions';

const login = handleActions({
    [actions.loginUpdateField]: (state, action) => ({...state, [action.payload.field]: action.payload.value}),
    [actions.loginPending]: (state, action) => ({...state, working: true, error: null}),
    [actions.loginSuccess]: (state, action) => ({...state, working: false, error: null, username: '', password: ''}),
    [actions.loginFailure]: (state, action) => ({...state, working: false, error: action.payload})
}, {
    username: '',
    password: '',
    working: false,
    error: null
});

const calendar = handleActions({
    [actions.calendarChangeDate]: (state, action) => ({...state, selectedDate: action.payload}),
    [actions.calendarUpdateQuery]: (state, action) => ({...state, query: action.payload}),
    [actions.calendarChangeMonth]: (state, action) => ({...state, month: action.payload, modal: false}),
    [actions.calendarShowModal]: (state, action) => ({...state, modal: action.payload}),
}, {
    selectedDate: moment(),
    query: '',
    modal: false,
    month: moment()
});

export {datastore, calendar, homeworkEdit, login};