import axios from "axios"
import { addHeaderWithToken } from "./auth"
import { errorAC } from './errors'
import { createSuccessMessage } from "./success"

const SET_RECOMMENDED_INTAKE = 'SET_RECOMMENDED_INTAKE'
const CLEAR_RECOMMENDED_INTAKE = 'CLEAR_RECOMMENDED_INTAKE'

const initialState = {
  intake: null,
  exists: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case CLEAR_RECOMMENDED_INTAKE:
      return initialState
    case SET_RECOMMENDED_INTAKE:
      return {
        intake: action.payload,
        exists: true
      }
    default:
      return state
  }
}

export const clearRecomendedIntake = () => ({ type: CLEAR_RECOMMENDED_INTAKE })

export const getUserRecomendedIntakeThunk = () => (dispatch, getState) => {
  const username = getState().auth.user.username
  axios.get(`/api/daily-calorie-intake?search=${username}`, addHeaderWithToken(getState))
    .then(res => {
      if (res.data.length !== 0) {
        dispatch({
          type: SET_RECOMMENDED_INTAKE,
          payload: res.data[0]
        })
      }
    })
    .catch(error => {
      dispatch(errorAC(error.toJSON().message, error.response.status))
    })
}

export const createOrUpdateUserRecomendedIntakeThunk = (daily_calorie_intake) => (dispatch, getState) => {
  const username = getState().auth.user.username
  const body = { username, daily_calorie_intake }
  if (getState().intake.exists) {
    const intakeId = getState().intake.intake.id
    axios.put(`/api/daily-calorie-intake/${intakeId}/`, body, addHeaderWithToken(getState))
      .then(res => {
        dispatch(createSuccessMessage('Recomended Calorie Input Was Updated'))
        dispatch({
          type: SET_RECOMMENDED_INTAKE,
          payload: res.data[0].daily_calorie_intake
        })
      })
      .catch(error => {
        dispatch(errorAC("There Was An Error", error.response.status))
      })
  }
  else {
    axios.post(`/api/daily-calorie-intake/`, body, addHeaderWithToken(getState))
      .then(res => {
        dispatch(createSuccessMessage('Recomended Calorie Input Was Created'))
        dispatch({
          type: SET_RECOMMENDED_INTAKE,
          payload: res.data[0].daily_calorie_intake
        })
      })
      .catch(error => {
        dispatch(errorAC("There Was An Error", error.response.status))
      })
  }
}