import { handleActions } from 'redux-actions';

import * as actions from '../actions';

export default handleActions({
    [actions.updateHomeworkLocal]: (state, action) => {
        return {...state, homework: state.homework.map(homework => {
            if(homework._id === action.payload._id) {
                return {...homework, ...action.payload.partial};
            } else {
                return homework;
            }
        })}
    },
    [actions.saveHomeworkLocal]: (state, action) => {
        return {...state, homework: [...state.homework, action.payload]};
    },
    [actions.deleteHomeworkLocal]: (state, action) => {
        return {...state, homework: state.homework.filter(homework => homework._id !== action.payload)};
    },
    [actions.loginSuccess]: (state, action) => ({...state, authToken: action.payload}),
    [actions.downloadPending]: (state, action) => ({...state, [`loading${action.payload}`]: true}),
    [actions.downloadSuccess]: (state, action) => ({...state, [`loading${action.payload.group}`]: false, [action.payload.group.toLowerCase()]: action.payload.data}),
    [actions.downloadFailure]: (state, action) => ({...state, [`loading${action.payload.group}`]: false, [action.payload.group.toLowerCase()]: null})
}, {
    queue: [],
    loadingProfile: false, profile: {},
    loadingHomework: false, homework: [],
    loadingMenu: false, menu: [],
    loadingCalendar: false, calendar: [],
    loadingTimetable: false, timetable: [],
    authToken: null
})