import { ofType } from 'redux-observable'
import { map, mergeMap, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'

import access_token from './access-token.js'

const FETCH_USER = 'FETCH_USER';
const FETCH_USER_FULFILLED = 'FETCH_USER_FULFILLED';
const FETCH_USER_REJECTED = 'FETCH_USER_REJECTED';
const TOGGLE_FAKE_LOADING = 'TOGGLE_FAKE_LOADING'

// action creators
export const fetchUser = username => ({ type: FETCH_USER, payload: username });
const fetchUserFulfilled = payload => ({ type: FETCH_USER_FULFILLED, payload })
const fetchUserRejected = payload => ({ type: FETCH_USER_REJECTED, payload })
export const toggleFakeLoading = () => {
  return function(dispatch) {
    dispatch({ type: TOGGLE_FAKE_LOADING })
    setTimeout(() => dispatch({ type: TOGGLE_FAKE_LOADING }), 2000)
  }
}

// epic
export const fetchUserEpic = action$ => action$.pipe(
  ofType(FETCH_USER),
  mergeMap(action =>
    from(
      fetch(
        'https://api.github.com/users/' +
        action.payload + '?access_token=' + access_token
      ).then(
        res => {
          if (res.status === 200 && res.ok) {
            return res.json()
          } else {
            return Promise.reject(res.statusText)
          }
        }
      )
    ).pipe(
      map(response => fetchUserFulfilled(response)),
      catchError(error => of(fetchUserRejected({
        name: action.payload,
        error,
      })))
    )
  )
);

export const users = (state = {}, action) => {
  switch (action.type) {
    case FETCH_USER_FULFILLED:
      return {
        ...state,
        // `login` is the username
        [action.payload.login]: action.payload
      };
    case FETCH_USER_REJECTED:
      return {
        ...state,
        [action.payload.name]: action.payload.error
      };

    default:
      return state;
  }
};

export const notification = (state = {}, action) => {
  switch (action.type) {
    case TOGGLE_FAKE_LOADING:
      return {
        ...state,
        isLoading: !state.isLoading
      };
    default:
      return state;
  }
}
