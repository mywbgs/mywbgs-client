import * as moment from 'moment';

export const periodStarts = [
    {i: 0, h: 8, m: 55},
    {i: 1, h: 9, m: 55},
    {i: 2, h: 11, m: 15},
    {i: 3, h: 12, m: 15},
    {i: 4, h: 14, m: 15},
    {i: 5, h: 15, m: 15}
];

export const firstInstanceOfSubject = (subject, date, timetable) => {
    const day = date.isoWeekday() - 1;
    if(day > 4) throw new Error('Cannot be on weekend!');
    return timetable[day].findIndex(period => period.subject === subject);
}

export const getNextPeriodsOfSubject = (subject, timetable, count) => {
    const daysWithSubject = timetable.map(day => day.reduce((found, period) => found || period.subject === subject, false));
    if(daysWithSubject.filter(x => x).length === 0) return [];
    // E.g [false, false, true, false, false]
    const results = [];
    let currentDate = moment().add(1, 'day');
    while(results.length < (count || 2)) {
        if(daysWithSubject[currentDate.isoWeekday() - 1]) {
            results.push(currentDate.clone());
        }
        currentDate.add(1, 'day');
    }
    return results;
}

export const getPassedPeriods = (count, date, allPeriods) => periodStarts
    .filter(period => allPeriods ? true : period.i < 5)
    .filter(period => date.isAfter(date.clone().hours(period.h).minutes(period.m)))
    .map(period => period.i)
    .slice(-count).reverse();

export const periodToOrdinal = period => ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'][period - 1];

export const getSubject = (timetable, date, period) => {
    const dayOfWeek = date.isoWeekday() - 1;
    if(dayOfWeek > 4) throw new Error('Cannot be on weekend!');
    return timetable[dayOfWeek][period];
}

export const filterUntil = (array, predicate) => {
    const results = [];
    for(let i = 0; i < array.length; i++) {
        const predicateResult = predicate(array[i]);
        if(predicateResult.match) {
            results.push(array[i]);
        }
        if(predicateResult.quit) {
            return results;
        }
    }
    return results;
}

export const typeOfDuration = (start, end) => {
    if(start.isSame(end)) {
        return 'START_SAME_END';
    } else if (start.isSame(end.clone().startOf('day')) && end.isSame(start.clone().endOf('day'))) {
        return 'ALL_DAY';
    } else if (!start.clone().startOf('day').isSame(end.clone().startOf('day'))) {
        return 'MANY_DAYS';
    }
    return 'START_END_IN_SAME_DAY';
}

export const labelForDuration = (start, end) => {
    const durationType = typeOfDuration(start, end);
    if(durationType === 'START_SAME_END') {
        return formatTime(start);
    } else if (durationType === 'ALL_DAY') {
        return 'All day';
    } else if (durationType === 'MANY_DAYS') {
        return `${start.format('dddd Do')} - ${end.format('dddd Do')}`;
    }
    return `${formatTime(start)} - ${formatTime(end)}`;
}

export const rankingForDuration = durationType => {
    if (durationType === 'ALL_DAY') {
        return 1
    } else if (durationType === 'MANY_DAYS') {
        return 0;
    }
    return 2
}

export const sortEvents = (event1, event2) => {
    const start1 = moment(event1.start);
    const start2 = moment(event2.start);
    const type1 = typeOfDuration(start1, moment(event1.end));
    const type2 = typeOfDuration(start2, moment(event2.end));
    const ranking1 = rankingForDuration(type1);
    const ranking2 = rankingForDuration(type2);
    if(ranking1 !== ranking2) {
        return ranking1 > ranking2 ? -1 : 1;
    } else if(type1 === 'START_SAME_END' || type1 === 'START_END_IN_SAME_DAY') {
        return start1.isBefore(start2) ? -1 : 1;
    } else if (type2 === 'MANY_DAYS') {
        // Ordering reversed because long events which have started more recently
        // are more more important
        return start1.isBefore(start2) ? 1 : -1;
    }
    return 0;
}

export const formatTime = time => time.format('HH:mm');

export const getAllSubjectsInTimetable = timetable => {
    const results = new Set();
    timetable.forEach(day => day.forEach(period => results.add(period.subject)));
    return Array.from(results);
}