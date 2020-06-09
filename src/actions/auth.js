import axios from 'axios';
 
import {
    USER_LOADED,
    USER_LOADING,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    AUTH_ERROR
} from './types';
 
// CHECK TOKEN & LOAD USER
export const loader = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });
 
    // Get token from state
    const token = getState().auth.token;
 
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
 
    // If token, add to headers config
    if(token) {
        config.headers['Authorization'] = `Toekn ${token}`;
    }
    
    axios.get('/api/auth/user', config)
        .then(res => {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    }).catch(err => {
        dispatch({
            type: AUTH_ERROR
        });        
    });
};
 
// LOGIN USER
export const login = (username, password) => dispatch => {
 
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
 
    // Request Body
    const body = JSON.stringify({ username, password });
 
    axios.post('/api/auth/login', body, config)
        .then(res => {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch({
            type: LOGIN_FAIL
        });        
    });
};