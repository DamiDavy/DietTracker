import { createStore, applyMiddleware, Action } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk, { ThunkAction } from 'redux-thunk'
import mainReducer from '../reducers/mainReducer'

const initialState = {}

const middleware = [thunk]

type reducersType = typeof mainReducer
export type stateType = ReturnType<reducersType>

const store = createStore(
  mainReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export type ActionTypeApp<T> =
  T extends { [key: string]: (...args: any[]) => infer U } ? U : never

export type ThunkType<A extends Action, P = void> =
  ThunkAction<P, stateType, unknown, A>

export default store