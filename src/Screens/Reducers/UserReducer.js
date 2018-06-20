import {
  LOAD_LOGGED_USER,
  LOADING
} from '../Types'

const INITIAL_STATE = {
  loggedUser: {},
  loading: false
}


export default (state = INITIAL_STATE, action) => {

  if (action.type == LOAD_LOGGED_USER) return { ...state, loggedUser: action.payload }
  if (action.type == LOADING) return { ...state, loading: action.payload }

  return state;
}