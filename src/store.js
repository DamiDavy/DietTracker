import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from 'redux-thunk'
import mainReducer from './reducers/mainReducer'

const initialState = {}

const middleware = [thunk]

const store = createStore(
  mainReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store