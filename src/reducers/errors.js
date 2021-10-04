export const GET_ERRORS = 'GET_ERRORS'

const initialState = {
  message: null,
  status: null,
}

export const errorAC = (message, status) => {
  return {
    type: GET_ERRORS,
    payload: { message, status }
  }
}

export default function (state = initialState, action) {
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
