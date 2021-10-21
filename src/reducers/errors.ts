export const GET_ERRORS = 'GET_ERRORS'

const initialState = {
  message: null as string | null,
  status: null as number | null,
}

export interface errorActionType {
  type: string,
  payload: {
    message: string,
    status: number
  }
}

export default function (state = initialState, action: errorActionType) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        message: action.payload.message,
        status: action.payload.status,
      }
    default:
      return state
  }
}

export const errorAC = (message: string, status: number) => ({ type: GET_ERRORS, payload: { message, status } })