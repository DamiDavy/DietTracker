// export const GET_MESSAGE = 'GET_MESSAGE'
export const SET_MESSAGE = 'SET_MESSAGE'

const initialState = {
  message: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        message: action.payload,
      }
    default:
      return state
  }
}

export const createSuccessMessage = (mes) => ({ type: SET_MESSAGE, payload: mes })
