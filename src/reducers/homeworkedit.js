import { handleActions } from 'redux-actions';

import * as actions from '../actions';

const initial = {
    title: '',
    notes: '',
    subjectOptions: [],
    selectedSubject: null,
    teacherOptions: [],
    selectedTeacher: null,
    dateOptions: [],
    selectedDate: null,
    modal: false,
    saving: false,
    success: false,
    error: null
};

export default handleActions({
    [actions.saveStart]: (state, action) => ({...state, saving: true, error: null}),
    [actions.saveHomeworkSuccess]: (state, action) => ({...state, saving: false, success: true}),
    [actions.updateHomeworkSuccess]: (state, action) => ({...state, saving: false, success: true}),
    [actions.saveFailed]: (state, action) => {
        const err = action.payload;
        let error = 'Could not connect to server';
        if(err.response) {
            error = `An unknown error occurred (${err.response.status})`;
        }
        return {...state, saving: false, success: false, error};
    },
    [actions.editUpdateField]: (state, action) => ({...state, [action.payload.field]: action.payload.value}),
    [actions.editLoad]: (state, action) => {
        return {
            ...initial,
            subjectOptions: action.payload.subjects,
            selectedSubject: action.payload.selectedSubject,
            teacherOptions: action.payload.teacherOptions,
            selectedTeacher: action.payload.selectedTeacher,
            dateOptions: action.payload.dateOptions,
            selectedDate: action.payload.selectedDate,
            title: action.payload.title || '',
            notes: action.payload.notes || '',
            saving: false,
            success: false
        }
    },
    [actions.editSelectSubject]: (state, action) => {
        const isCurrentOption = state.subjectOptions.findIndex(option => option === action.payload.subject) !== -1;
        const newOptions = [...state.subjectOptions];
        if(!isCurrentOption) {
            const index = Math.max(newOptions.length - 1, 0);
            newOptions[index] = action.payload.subject;
        }
        return {...state, subjectOptions: newOptions, selectedSubject: action.payload.subject, teacherOptions: action.payload.teacherOptions, selectedTeacher: action.payload.selectedTeacher, dateOptions: action.payload.dateOptions, selectedDate: action.payload.selectedDate};
    },
    [actions.editSelectTeacher]: (state, action) => {
        return {...state, ...action.payload};
    },
    [actions.editSelectDate]: (state, action) => {
        const isCurrentOption = state.dateOptions.findIndex(date => date.isSame(action.payload, 'day')) !== -1;
        const newDates = [...state.dateOptions];
        if(!isCurrentOption) {
            newDates[newDates.length - 1] = action.payload;
        }
        return {...state, dateOptions: newDates, selectedDate: action.payload};    
    },
    [actions.editSetModalOpen]: (state, action) => ({...state, modal: action.payload}),
}, initial)