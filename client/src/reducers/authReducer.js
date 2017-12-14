import { FETCH_USER } from '../actions/types';
//whether or not the user is currently logged in
export default function(state = null, action) {
	switch (action.type) {
		case FETCH_USER:
			//user model or empty(not logged in, payload="")
			return action.payload || false;
		default:
			//return null if state not defined (which is initialization value)
			return state;
	}
}
