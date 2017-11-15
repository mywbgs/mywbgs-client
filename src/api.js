import * as axios from 'axios';

export const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});

export async function login(username, password) {
    try {
        const response = await instance({
            method: 'post',
            url: '/user/authenticate',
            data: {username, password}
        });
        if(response.data && response.data.success) {
            return {success: true, token: response.data.token};
        }
    } catch(err) {
        let message = `Could not connect to server`;
        if(err.response) {
            if(err.response.data && err.response.data.message) {
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
        url: '/user/profile',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function getTimetable(authToken) {
    const response = await instance({
        method: 'get',
        url: '/user/timetable',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function getHomework(authToken) {
    const response = await instance({
        method: 'get',
        url: '/homework',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function getCalendar(authToken) {
    const response = await instance({
        method: 'get',
        url: '/data/calendar',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function getMenu(authToken) {
    const response = await instance({
        method: 'get',
        url: '/data/menu',
        headers: {'X-Auth': authToken}
    });
    return response.data;
}

export async function createHomework(authToken, data) {
    const response = await instance({
        method: 'post',
        url: '/homework',
        headers: {'X-Auth': authToken},
        data: data
    });
    if(!response.data.success) throw new Error('Creating homework failed');
    return response.data.data;
}

export async function updateHomework(authToken, _id, partial) {
    delete partial._id;
    const response = await instance({
        method: 'put',
        url: `/homework/${_id}`,
        headers: {'X-Auth': authToken},
        data: partial
    });
    if(!response.data.success) throw new Error('Updating homework failed');
    return response.data.data;
}

export async function deleteHomework(authToken, _id) {
    const response = await instance({
        method: 'delete',
        url: `/homework/${_id}`,
        headers: {'X-Auth': authToken}
    });
    if(!response.data.success) throw new Error('Deleting homework failed');
    return true;
}