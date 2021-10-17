import axios from "axios"
import { addHeaderWithToken } from "./auth"
import { errorAC } from './errors'
import { createSuccessMessage } from "./success"

const SET_RECOMMENDED_INTAKE = 'SET_RECOMMENDED_INTAKE'
const CLEAR_RECOMMENDED_INTAKE = 'CLEAR_RECOMMENDED_INTAKE'

const initialState = {
  intake: null,
  id: null,
  exists: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case CLEAR_RECOMMENDED_INTAKE:
      return initialState
    case SET_RECOMMENDED_INTAKE:
      return {
        ...state,
        intake: action.payload,
        id: action.id,
        exists: true
      }
    default:
      return state
  }
}

export const clearRecomendedIntake = () => ({ type: CLEAR_RECOMMENDED_INTAKE })

export const getUserRecomendedIntakeThunk = () => (dispatch, getState) => {
  const username = getState().auth.user.username
  axios.get(`http://127.0.0.1:8000/api/daily-calorie-intake?search=${username}`, addHeaderWithToken(getState))
    .then(res => {
      if (res.data.length !== 0) {
        dispatch({
          type: SET_RECOMMENDED_INTAKE,
          id: res.data[0].id,
          payload: res.data[0].daily_calorie_intake
        })
      }
    })
    .catch(error => {
      dispatch(errorAC(error.toJSON().message, error.response.status))
    })
}

export const createOrUpdateUserRecomendedIntakeThunk = (daily_calorie_intake) => (dispatch, getState) => {
  const username = getState().auth.user.username
  // const user = getState().auth.user.id
  const body = { username, daily_calorie_intake }
  if (getState().intake != null) {
    const intakeId = getState().intake.id
    axios.put(`http://127.0.0.1:8000/api/daily-calorie-intake/${intakeId}/`, body, addHeaderWithToken(getState))
      .then(res => {
        setTimeout(() => dispatch(createSuccessMessage('Recomended Calorie Input Was Updated')), 1000)
        dispatch({
          type: SET_RECOMMENDED_INTAKE,
          id: res.data.id,
          payload: res.data.daily_calorie_intake
          // payload: res.data[0].daily_calorie_intake
        })
      })
      .catch(error => {
        dispatch(errorAC("There Was An Error", error.response.status))
      })
  }
  else {
    axios.post(`http://127.0.0.1:8000/api/daily-calorie-intake/`, body, addHeaderWithToken(getState))
      .then(res => {
        setTimeout(() => dispatch(createSuccessMessage('Recomended Calorie Input Was Created')), 1000)
        dispatch({
          type: SET_RECOMMENDED_INTAKE,
          id: res.data.id,
          payload: res.data.daily_calorie_intake
          // payload: res.data[0].daily_calorie_intake
        })
      })
      .catch(error => {
        dispatch(errorAC("There Was An Error", error.response.status))
      })
  }
}