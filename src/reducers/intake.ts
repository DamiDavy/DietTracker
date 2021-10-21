import axios from "axios"
import { ThunkType } from "../components/store"
import { addHeaderWithToken } from "./auth"
import { errorAC, errorActionType } from "./errors"
import { createAction } from "./search"
import { createSuccessMessage, successActionType } from "./success"

const SET_RECOMMENDED_INTAKE = 'SET_RECOMMENDED_INTAKE'
const CLEAR_RECOMMENDED_INTAKE = 'CLEAR_RECOMMENDED_INTAKE'

const initialState: intakeInitialStateType = {
  intake: null,
  id: null,
  exists: false
}

interface intakeInitialStateType {
  intake: number,
  id: number,
  exists: boolean
}

export default function (state = initialState, action: intakesTypeLocal) {
  switch (action.type) {
    case CLEAR_RECOMMENDED_INTAKE:
      return initialState
    case SET_RECOMMENDED_INTAKE:
      return {
        ...state,
        intake: action.payload.intake,
        id: action.payload.id,
        exists: true
      }
    default:
      return state
  }
}

interface intakeType {
  id: number
  intake: number
}

export function setRecomendedIntake(intake: intakeType) {
  return createAction(SET_RECOMMENDED_INTAKE, "payload", intake)
}

export function clearRecomendedIntake() {
  return createAction(CLEAR_RECOMMENDED_INTAKE, null, null)
}

export type intakesTypeLocal = ReturnType<typeof setRecomendedIntake> | ReturnType<typeof clearRecomendedIntake>

export const getUserRecomendedIntakeThunk = (): intakeThunkType => (dispatch, getState) => {
  const username = getState().auth.user.username
  axios.get(`https://caloriecounterapi.herokuapp.com/api/daily-calorie-intake?search=${username}`, addHeaderWithToken(getState))
    .then(res => {
      if (res.data.length !== 0) {
        dispatch(setRecomendedIntake({ id: res.data[0].id, intake: res.data[0].daily_calorie_intake }))
      }
    })
    .catch(error => {
      dispatch(errorAC(error.toJSON().message, error.response.status))
    })
}

export const createOrUpdateUserRecomendedIntakeThunk = (daily_calorie_intake: number): intakeThunkType => (dispatch, getState) => {
  const username = getState().auth.user.username
  const body = { username, daily_calorie_intake }
  if (getState().intake != null) {
    const intakeId = getState().intake.id
    axios.put(`https://caloriecounterapi.herokuapp.com/api/daily-calorie-intake/${intakeId}/`, body, addHeaderWithToken(getState))
      .then(res => {
        setTimeout(() => dispatch(createSuccessMessage('Recomended Calorie Input Was Updated')), 1000)
        dispatch(setRecomendedIntake({ id: res.data.id, intake: res.data.daily_calorie_intake }))
      })
      .catch(error => {
        dispatch(errorAC("There Was An Error", error.response.status))
      })
  }
  else {
    axios.post(`https://caloriecounterapi.herokuapp.com/api/daily-calorie-intake/`, body, addHeaderWithToken(getState))
      .then(res => {
        setTimeout(() => dispatch(createSuccessMessage('Recomended Calorie Input Was Created')), 1000)
        dispatch(setRecomendedIntake({ id: res.data.id, intake: res.data.daily_calorie_intake }))
      })
      .catch(error => {
        dispatch(errorAC("There Was An Error", error.response.status))
      })
  }
}

type intakeThunkType = ThunkType<intakesTypeLocal | errorActionType | successActionType>