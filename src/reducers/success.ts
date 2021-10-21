const SET_MESSAGE = 'SET_MESSAGE'

const initialState = {
  message: null as string
}

export default function (state = initialState, action: successActionType) {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        message: action.payload,
      }
    default:
      return state
  }
}

export interface successActionType {
  type: string,
  payload: string,
}

export const createSuccessMessage = (mes: string) => ({ type: SET_MESSAGE, payload: mes })