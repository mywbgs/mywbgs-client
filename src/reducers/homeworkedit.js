import { handleActions } from 'redux-actions';

import * as actions from '../actions';

const initial = {
    title: '',
    notes: '',
    subjectOptions: [],
    selectedSubject: null,
    dateOptions: [],
    selectedDate: null,
    modal: false
};

export default handleActions({
    [actions.editUpdateField]: (state, action) => ({...state, [action.payload.field]: action.payload.value}),
    [actions.editLoad]: (state, action) => {
        return {
            ...state,
            subjectOptions: action.payload.subjects,
            selectedSubject: action.payload.selectedSubject,
            dateOptions: action.payload.dateOptions,
            selectedDate: action.payload.selectedDate,
            title: action.payload.title || '',
            notes: action.payload.notes || ''
        }
    },
    [actions.editSelectSubject]: (state, action) => {
        const isCurrentOption = state.subjectOptions.findIndex(option => option === action.payload.subject) !== -1;
        const newOptions = [...state.subjectOptions];
        if(!isCurrentOption) {
            const index = Math.max(newOptions.length - 1, 0);
            newOptions[index] = action.payload.subject;
        }
        return {...state, subjectOptions: newOptions, selectedSubject: action.payload.subject, dateOptions: action.payload.dateOptions, selectedDate: action.payload.selectedDate};
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
    [actions.saveHomework]: (state, action) => initial
}, initial)