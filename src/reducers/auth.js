import axios from 'axios'
import { errorAC } from './errors'
import { clearRecomendedIntake } from './intake'
import { SET_MESSAGE } from './success'

const USER_LOADING = 'USER_LOADING'
const USER_LOADED = 'USER_LOADED'
const AUTH_ERROR = 'AUTH_ERROR'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGIN_FAIL = 'LOGIN_FAIL'

const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
const REGISTER_FAIL = 'REGISTER_FAIL'

const initialState = {
  token: localStorage.getItem('tok'),
  isAuth: null,
  isLoading: false,
  user: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      }
    case USER_LOADED:
      return {
        ...state,
        isAuth: true,
        isLoading: false,
        user: action.payload,
      }
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('tok', action.payload.token)
      return {
        ...state,
        ...action.payload,
        isAuth: true,
        isLoading: false
      }
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem('tok')
      return {
        ...state,
        isAuth: false,
        isLoading: false,
        user: null,
        token: null
      }
    default:
      return state
  }
}

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING })

  axios.get('http://127.0.0.1:8000/api/auth/user', addHeaderWithToken(getState))
    .then(res => {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    })
    .catch(() => {
      dispatch({ type: AUTH_ERROR })
    })
}

export const loginUser = (username, password) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const body = JSON.stringify({ username, password })

  axios.post('http://127.0.0.1:8000/api/auth/login', body, config)
    .then(res => {
      dispatch({
        type: SET_MESSAGE,
        payload: `Hey, ${username}!`
      })
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    })
    .catch(error => {
      dispatch(errorAC("Invalid Username Or Password", error.response.status))
      dispatch({ type: LOGIN_FAIL })
    })
}

export const logoutUser = () => (dispatch, getState) => {

  axios.post('http://127.0.0.1:8000/api/auth/logout', null, addHeaderWithToken(getState))
    .then(() => {
      dispatch({
        type: SET_MESSAGE,
        payload: 'Logged Out'
      })
      dispatch({
        type: LOGOUT_SUCCESS
      })
      dispatch(clearRecomendedIntake())
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    })
}

export const registerUser = (username, email, password) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const body = JSON.stringify({ username, email, password })

  axios.post('http://127.0.0.1:8000/api/auth/register', body, config)
    .then(res => {
      dispatch({
        type: SET_MESSAGE,
        payload: 'Registered successfully'
      })
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
      dispatch({ type: REGISTER_FAIL })
    })
}

export function addHeaderWithToken(getState) {
  const token = getState().auth.token
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (token) {
    config.headers['Authorization'] = `Token ${token}`
  }
  return config
}