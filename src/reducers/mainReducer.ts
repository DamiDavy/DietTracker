import { combineReducers } from "redux"
import foods from './foods'
import errors from './errors'
import success from './success'
import auth from './auth'
import days from './days'
import intake from './intake'
import search from './search'

export default combineReducers({ foods, days, errors, success, auth, intake, search })