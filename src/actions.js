import { createAction } from 'redux-actions';
import * as moment from 'moment';

import * as utils from './utils';

export const loginUpdateField = createAction('LOGIN_UPDATE_FIELD', (field, value) => ({field, value}));
export const loginPending = createAction('LOGIN_PENDING');
export const loginSuccess = createAction('LOGIN_SUCCESS', token => token);
export const loginFailure = createAction('LOGIN_FAILURE', message => message);
export const login = (username, password) => {
    return (dispatch, getState, api) => {
        dispatch(loginPending());
        api.login(username, password)
            .then(result => {
                if(result.success) {
                    dispatch(loginSuccess(result.token));
                } else {
                    dispatch(loginFailure(result.message));
                }
            });
    };
};
export const logout = createAction('LOGOUT');

export const calendarChangeDate = createAction('CALENDAR_CHANGE_DATE', newDate => newDate);
export const calendarUpdateQuery = createAction('CALENDAR_UPDATE_QUERY', newQuery => newQuery);
export const calendarChangeMonth = createAction('CALENDAR_CHANGE_MONTH', newMonth => newMonth);
export const calendarShowModal = createAction('CALENDAR_SHOW_MODAL', show => show);

export const editLoad = createAction('EDIT_LOAD', (date, timetable, homework) => {
    const suggestedPeriods = utils.getPassedPeriods(date);
    const dayOfWeek = Math.min(date.isoWeekday() - 1, 4);

    const lessons = suggestedPeriods.map(period => timetable[dayOfWeek][period]).filter(period => !period.free);
    const subjects = lessons.map(lessons => lessons.subject);
    let selectedSubject = subjects[0];
    if(homework) {
        const homeworkSubject = utils.getSubject(timetable, moment(homework.due), homework.period).subject;
        const subjectIndex = subjects.findIndex(subject => subject === homeworkSubject);
        if(subjectIndex === -1) {
            subjects.push(homeworkSubject);
        }
        selectedSubject = homeworkSubject;
    }
    
    const dateOptions = utils.getNextPeriodsOfSubject(selectedSubject, timetable, 2);
    let selectedDate = dateOptions[0];
    if(homework) {
        const homeworkDue = moment(homework.due);
        const dateIndex = dateOptions.findIndex(date => date.isSame(homework.due, 'day'));
        if(dateIndex === -1) {
            dateOptions.push(homeworkDue);
        }
        selectedDate = homeworkDue;
    }

    return {
        subjects,
        selectedSubject,
        dateOptions,
        selectedDate,
        title: homework ? homework.title : '',
        notes: homework ? homework.notes : ''
    };
});
export const editSelectSubject = createAction('EDIT_SELECT_SUBJECT', (subject, timetable) => {
    const dateOptions = utils.getNextPeriodsOfSubject(subject, timetable, 2);
    return {subject, dateOptions, selectedDate: dateOptions[0]};
});
export const editSetModalOpen = createAction('SET_MODAL_OPEN', modal => modal);
export const editSelectDate = createAction('EDIT_SELECT_DATE', date => date);
export const editUpdateField = createAction('EDIT_UPDATE_FIELD', (field, value) => ({field, value}));

export const saveStart = createAction('SAVE_START');
export const saveFailed = createAction('SAVE_FAILED', err => err);

export const saveHomework = homework => {
    return (dispatch, getState, api) => {
        const { authToken } = getState().datastore;
        dispatch(saveStart());
        api.createHomework(authToken, homework)
            .then(result => dispatch(saveHomeworkSuccess(result)), err => dispatch(saveFailed(err)));
    };
}
export const saveHomeworkSuccess = createAction('SAVE_HOMEWORK_SUCCCESS', homework => ({homework}));

export const updateHomework = (id, partial) => {
    return (dispatch, getState, api) => {
        const { authToken } = getState().datastore;
        dispatch(saveStart());
        api.updateHomework(authToken, id, partial)
            .then(result => dispatch(updateHomeworkSuccess(id, result)), err => dispatch(saveFailed(err)));
    }
}
export const updateHomeworkSuccess = createAction('UPDATE_HOMEWORK_SUCCESS', (id, partial) => ({id, partial}));

export const deleteHomework = id => {
    return (dispatch, getState, api) => {
        const { authToken } = getState().datastore;
        dispatch(saveStart());
        api.deleteHomework(authToken, id)
            .then(success => dispatch(deleteHomeworkSuccess(id)), err => dispatch(saveFailed(err)));
    }
}
export const deleteHomeworkSuccess = createAction('DELETE_HOMEWORK_SUCCESS', id => ({id}));

export const downloadPending = createAction('DOWNLOAD_PENDING', group => group);
export const downloadSuccess = createAction('DOWNLOAD_SUCCESS', (group, data) => ({group, data}));
export const downloadFailure = createAction('DOWNLOAD_FAILURE', (group, err) => {
    console.error(err);
    return {group, err};
});
export const downloadAll = () => {
    return (dispatch, getState, api) => {
        const { authToken } = getState().datastore;
        dispatch(downloadPending('Homework'));
        api.getHomework(authToken).then(homework => dispatch(downloadSuccess('Homework', homework)), err => dispatch(downloadFailure('Homework', err)));
        
        dispatch(downloadPending('Timetable'));
        api.getTimetable(authToken).then(timetable => dispatch(downloadSuccess('Timetable', timetable)), err => dispatch(downloadFailure('Timetable', err)));
        
        dispatch(downloadPending('Profile'));
        api.getProfile(authToken).then(profile => dispatch(downloadSuccess('Profile', profile)), err => dispatch(downloadFailure('Profile', err)));
        
        dispatch(downloadPending('Calendar'));
        api.getCalendar(authToken).then(calendar => dispatch(downloadSuccess('Calendar', calendar)), err => dispatch(downloadFailure('Calendar', err)));
        
        // dispatch(downloadPending('Menu'));
        // api.getMenu(authToken).then(menu => dispatch(downloadSuccess('Menu', menu)), err => dispatch(downloadFailure('Menu', err)));
    }
};

// export const queueAdd = createAction('QUEUE_ADD', request => request);