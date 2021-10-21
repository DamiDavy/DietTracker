import axios from 'axios'
import { ThunkType } from '../components/store'
import { addHeaderWithToken } from './auth'
import { errorAC, errorActionType } from './errors'
import { createAction } from './search'

const GET_DAYS = 'GET_DAYS'
const SET_DAY_TO_ADD_FOOD_IN = 'SET_DAY_TO_ADD_FOOD_IN'
const ADD_DAY_TO_LOADED = 'ADD_DAY_TO_LOADED'
const DELETE_DAY_FROM_LOADED = 'DELETE_DAY_FROM_LOADED'
const CLEAR_DAYS_STATE = 'CLEAR_DAYS_STATE'
const SET_CALENDAR_IS_RENDERED = 'SET_CALENDAR_IS_RENDERED'
const DROP_CALENDAR_STATE_ON_LOGOUT = 'DROP_CALENDAR_STATE_ON_LOGOUT'

const initialState: intakeInitialStateType = {
  days: [],
  dayToAddFoodIn: null,
  datesWereLoaded: [],
  calendarIsRendered: false
}

export default function (state = initialState, action: actionsTypeLocal) {
  switch (action.type) {
    case DROP_CALENDAR_STATE_ON_LOGOUT:
      return initialState
    case SET_CALENDAR_IS_RENDERED:
      return {
        ...state,
        calendarIsRendered: true
      }
    case CLEAR_DAYS_STATE:
      return {
        ...initialState,
        dayToAddFoodIn: state.dayToAddFoodIn,
      }
    case GET_DAYS:
      return {
        ...state,
        days: action.payload
      }
    case SET_DAY_TO_ADD_FOOD_IN:
      return {
        ...state,
        dayToAddFoodIn: action.payload,
      }
    case ADD_DAY_TO_LOADED:
      return {
        ...state,
        datesWereLoaded: [...state.datesWereLoaded, action.payload]
      }
    case DELETE_DAY_FROM_LOADED:
      return {
        ...state,
        datesWereLoaded: state.datesWereLoaded.filter(item => +item != +action.payload)
      }
    default:
      return state
  }
}

export function clearCurrentMonthInfoInDays() {
  return createAction(CLEAR_DAYS_STATE, null, null)
}
export function setCalendarIsRendered() {
  return createAction(SET_CALENDAR_IS_RENDERED, null, null)
}
export function addDayToLoaded(num: number) {
  return createAction(ADD_DAY_TO_LOADED, "payload", num)
}
export function deleteDayFromLoaded(num: number) {
  return createAction(DELETE_DAY_FROM_LOADED, "payload", num)
}
export function setDayToAddFoodIn(dateObject: DayType) {
  return createAction(SET_DAY_TO_ADD_FOOD_IN, "payload", dateObject)
}
export function getdays(dateArray: DayType[]) {
  return createAction(GET_DAYS, "payload", dateArray)
}
export function dropCalendarOnLogout() {
  return createAction(DROP_CALENDAR_STATE_ON_LOGOUT, null, null)
}

type actionsTypeLocal = ReturnType<typeof clearCurrentMonthInfoInDays> | ReturnType<typeof setCalendarIsRendered> |
  ReturnType<typeof addDayToLoaded> | ReturnType<typeof deleteDayFromLoaded> | ReturnType<typeof setDayToAddFoodIn> |
  ReturnType<typeof getdays> | ReturnType<typeof dropCalendarOnLogout>

type localThunkType = ThunkType<actionsTypeLocal | errorActionType>

export const createOrGetDay = (day: number, month: string, year: number): localThunkType => (dispatch, getState) => {
  const userId = getState().auth.user.id
  const body = { user: userId, day, month, year }

  axios.post('https://caloriecounterapi.herokuapp.com/api/days/', body, addHeaderWithToken(getState))
    .then(res => {
      dispatch(setDayToAddFoodIn(res.data))
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    })
}

export const searchDays = (year: number, month: string): localThunkType => (dispatch, getState) => {
  axios
    .get(`https://caloriecounterapi.herokuapp.com/api/days?year=${year}&month=${month}`, addHeaderWithToken(getState))
    .then(res => {
      dispatch(getdays(res.data))
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    });
}

export interface DayType {
  id: number
  day: string
  month: string
  year: string
  user: number
}
interface intakeInitialStateType {
  days: DayType[],
  dayToAddFoodIn: DayType,
  datesWereLoaded: number[],
  calendarIsRendered: boolean
}