import axios from 'axios'
import { errorAC, errorActionType } from './errors'
import { ThunkType } from '../components/store'

const GET_FOODS = 'GET_FOODS'
const TOGGLE_DROPDOWN_VISIBILITY = 'TOGGLE_DROPDOWN_VISIBILITY'
const FOOD_IS_LOADING = 'FOOD_IS_LOADING'

const initialState: searchInitialStateType = {
  foods: [],
  dropDownIsVisible: false,
  foodIssLoading: false,
}

export default function (state = initialState, action: actionsTypeLocal): searchInitialStateType {
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

export function createAction<T extends string, U, K extends string>(type: T, key: K, payload: U) {
  return ({
    type,
    [key]: payload
  }) as { type: T; } & { [P in K]: U }
}

export function getFoods(foods: FoodType[]) {
  return createAction(GET_FOODS, "payload", foods)
}

export function toggleDropdownVisibility(bool: boolean) {
  return createAction(TOGGLE_DROPDOWN_VISIBILITY, "payload", bool)
}

export function foodIsLoading() {
  return createAction(FOOD_IS_LOADING, null, null)
}

type actionsTypeLocal = ReturnType<typeof getFoods> | ReturnType<typeof toggleDropdownVisibility> |
  ReturnType<typeof foodIsLoading>

export const foodsSearch = (title: string): searchThunkType => dispatch => {
  dispatch(foodIsLoading())
  axios
    .get(`https://caloriecounterapi.herokuapp.com/api/foods?search=${title}`)
    .then(res => {
      dispatch(getFoods(res.data))
    })
    .catch(error => {
      dispatch(errorAC(error.toJSON().message, error.response.status))
    });
}

type searchThunkType = ThunkType<actionsTypeLocal | errorActionType>

export interface FoodType {
  id: number
  title: string
  calorie_content: number
  protein_content: string
  fat_content: string
  carbohydrate_content: string
  image: string
  category: number[]
}
interface searchInitialStateType {
  foods: FoodType[],
  dropDownIsVisible: boolean,
  foodIssLoading: boolean,
}