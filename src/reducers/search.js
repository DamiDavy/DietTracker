import axios from 'axios'
import { errorAC } from './errors'

const GET_FOODS = 'GET_FOODS'
const TOGGLE_DROPDOWN_VISIBILITY = 'TOGGLE_DROPDOWN_VISIBILITY'
const FOOD_IS_LOADING = 'FOOD_IS_LOADING'

const initialState = {
  foods: [],
  dropDownIsVisible: false,
  foodIssLoading: false,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DROPDOWN_VISIBILITY:
      return {
        ...state,
        dropDownIsVisible: action.payload
      }
    case GET_FOODS:
      return {
        ...state,
        foodIssLoading: false,
        foods: action.payload
      }
    case FOOD_IS_LOADING:
      return {
        ...state,
        foodIssLoading: true,
      }
    default:
      return state
  }
}

export const toggleDropdownVisibility = (bool) => ({
  type: TOGGLE_DROPDOWN_VISIBILITY,
  payload: bool
})

export const foodsSearch = title => dispatch => {
  dispatch({ type: FOOD_IS_LOADING })
  axios
    .get(`https://caloriecounterapi.herokuapp.com/api/foods?search=${title}`)
    .then(res => {
      dispatch({
        type: GET_FOODS,
        payload: res.data
      })
    })
    .catch(error => {
      dispatch(errorAC(error.toJSON().message, error.response.status))
    });
}