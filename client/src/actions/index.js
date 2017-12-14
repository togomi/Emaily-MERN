import axios from 'axios';
import { FETCH_USER } from './types';

// fetch user action creator
//redux-thunk will automatically detect this and pass to dispatch function
export const fetchUser = () => async dispatch => {
	//figure out if user is signed in
	const res = await axios.get('/api/current_user');
	dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
	const res = await axios.post('/api/stripe', token);

	dispatch({ type: FETCH_USER, payload: res.data });
};
