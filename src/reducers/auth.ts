import axios from 'axios'
import { stateType, ThunkType } from '../components/store'
import { errorAC, errorActionType } from './errors'
import { clearRecomendedIntake, intakesTypeLocal } from './intake'
import { createAction } from './search'
import { createSuccessMessage, successActionType } from './success'

const USER_LOADING = 'USER_LOADING'
const USER_LOADED = 'USER_LOADED'
const AUTH_ERROR = 'AUTH_ERROR'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const REGISTER_SUCCESS = 'REGISTER_SUCCESS'

const initialState: initialStateType = {
  token: localStorage.getItem('tok'),
  isAuth: null,
  isLoading: false,
  user: null,
}

export default function (state = initialState, action: actionsTypeLocal) {
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

interface userWithTokenType {
  user: userType
  token: string
}

function userLoading() {
  return createAction(USER_LOADING, null, null)
}
function userLoaded(user: userType) {
  return createAction(USER_LOADED, "payload", user)
}
function userLoggedIn(userWithToken: userWithTokenType) {
  return createAction(LOGIN_SUCCESS, "payload", userWithToken)
}
function registerSuccess(userWithToken: userWithTokenType) {
  return createAction(REGISTER_SUCCESS, "payload", userWithToken)
}
function authError() {
  return createAction(AUTH_ERROR, null, null)
}

type actionsTypeLocal = ReturnType<typeof userLoading> | ReturnType<typeof userLoaded> |
  ReturnType<typeof userLoggedIn> | ReturnType<typeof registerSuccess> | ReturnType<typeof authError>

type localThunkType = ThunkType<actionsTypeLocal | errorActionType | successActionType | intakesTypeLocal>


export const loadUser = (): localThunkType => (dispatch, getState) => {
  dispatch(userLoading())

  axios.get('https://caloriecounterapi.herokuapp.com/api/auth/user', addHeaderWithToken(getState))
    .then(res => {
      dispatch(userLoaded(res.data))
    })
    .catch(() => {
      dispatch(authError())
    })
}

export const loginUser = (username: string, password: string): localThunkType => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const body = JSON.stringify({ username, password })

  axios.post('https://caloriecounterapi.herokuapp.com/api/auth/login', body, config)
    .then(res => {
      dispatch(createSuccessMessage(`Hey, ${username}!`))
      dispatch(userLoggedIn(res.data))
    })
    .catch(error => {
      dispatch(errorAC("Invalid Username Or Password", error.response.status))
      dispatch(authError())
    })
}

export const logoutUser = (): localThunkType => (dispatch, getState) => {

  axios.post('https://caloriecounterapi.herokuapp.com/api/auth/logout', null, addHeaderWithToken(getState))
    .then(() => {
      dispatch(createSuccessMessage('Logged Out'))
      dispatch(authError())
      dispatch(clearRecomendedIntake())
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    })
}

export const registerUser = (username: string, email: string, password: string): localThunkType => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const body = JSON.stringify({ username, email, password })

  axios.post('https://caloriecounterapi.herokuapp.com/api/auth/register', body, config)
    .then(res => {
      dispatch(createSuccessMessage('Registered successfully'))
      dispatch(registerSuccess(res.data))
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
      dispatch(authError())
    })
}

interface headersObjectType {
  'Content-Type'?: 'application/json'
  'Authorization'?: string
}

interface configtype {
  headers: headersObjectType
}

type getStateType = () => stateType

export function addHeaderWithToken(getState: getStateType) {
  const token = getState().auth.token
  const config: configtype = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (token) {
    config.headers['Authorization'] = `Token ${token}`
  }
  return config
}

interface userType {
  id: number
  username: string
  email: string
}

interface initialStateType {
  token: string
  isAuth: boolean
  isLoading: boolean
  user: userType
}