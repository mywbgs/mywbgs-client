import * as axios from 'axios';

export const instance = axios.create({
    baseURL: 'https://mywbgs.herokuapp.com/'
    // baseURL: 'http://localhost:8080'
});

export async function login(username, password) {
    try {
        const response = await instance({
            method: 'post',
            url: '/student/authenticate',
            data: {username, password}
        });
        if(response.data && response.data.success) {
            return {success: true, token: response.data.result};
        }
    } catch(err) {
        let message = `Could not connect to server`;
        if(err.response) {
            if(err.response.data && err.response.data.result) {
                message = err.response.data.message;
            } else {
                message = `An unknown error occurred (${err.response.status})`;
            }
        }
        return {success: false, message};
    }
}

export async function getProfile(authToken) {
    const response = await instance({
        method: 'get',
        url: '/student/info',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function getTimetable(authToken) {
    const response = await instance({
        method: 'get',
        url: '/student/timetable',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function getHomework(authToken) {
    const response = await instance({
        method: 'get',
        url: '/assignment',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function getCalendar(authToken) {
    const response = await instance({
        method: 'get',
        url: '/calendar',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function getMenu(authToken) {
    const response = await instance({
        method: 'get',
        url: '/menu',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function createHomework(authToken, data) {
    const response = await instance({
        method: 'post',
        url: '/assignment',
        headers: {'X-Auth': authToken},
        data: data
    });
    if(!response.data.success) throw new Error('Creating homework failed');
    return response.data.result;
}

export async function updateHomework(authToken, id, partial) {
    delete partial.id;
    const response = await instance({
        method: 'put',
        url: `/assignment/${id}`,
        headers: {'X-Auth': authToken},
        data: partial
    });
    if(!response.data.success) throw new Error('Updating homework failed');
    return response.data.result;
}

export async function deleteHomework(authToken, id) {
    const response = await instance({
        method: 'delete',
        url: `/assignment/${id}`,
        headers: {'X-Auth': authToken}
    });
    if(!response.data.success) throw new Error('Deleting homework failed');
    return true;
}