import axios from 'axios'
import { CategoryType } from '../components/Categories'
import { foodBasketItemType } from '../components/FoodBasket'
import { ThunkType } from '../components/store'
import { addHeaderWithToken } from './auth'
import { DayType } from './days'
import { errorAC, errorActionType } from './errors'
import { createAction, FoodType } from './search'
import { createSuccessMessage, successActionType } from './success'

const FOODS_LOADING = 'FOODS_LOADING'
const GET_CATEGORIES = 'GET_CATEGORIES'
const ADD_FOOD_TO_BASKET = 'ADD_FOOD_TO_BASKET'
const CREATE_DAY_BASKET = 'CREATE_DAY_BASKET'
const CREATE_EMPTY_DAY_BASKET = 'CREATE_EMPTY_DAY_BASKET'
const CLEAR_FOOD_BUSKET = 'CLEAR_FOOD_BUSKET'
const SET_CALORIE_CAPACITY = 'SET_CALORIE_CAPACITY'
const NULL_CALORIE_CAPACITY = 'NULL_CALORIE_CAPACITY'
const CLEAR_FOOD_STATE = 'CLEAR_FOOD_STATE'
const DELETE_FOOD_FROM_BASKET = 'DELETE_FOOD_FROM_BASKET'
const DELETE_FOOD_FROM_DAY_BASKET = 'DELETE_FOOD_FROM_DAY_BASKET'
const DROP_FOODS_STATE_ON_LOGOUT = 'DROP_FOODS_STATE_ON_LOGOUT'

const initialState: initialStateType = {
  dailyBaskets: [],
  isLoading: false,
  categories: [],
  foodBasket: [],
  dailyCalories: []
}

export default function (state = initialState, action: actionsTypeLocal) {
  switch (action.type) {
    case FOODS_LOADING:
      return {
        ...state,
        isLoading: true,
      }
    case GET_CATEGORIES:
      return {
        ...state,
        isLoading: false,
        categories: action.payload
      }
    case ADD_FOOD_TO_BASKET:
      const product = state.foodBasket.find(product => product.food.title === action.payload.food.title)
      if (product !== undefined) {
        const newBasket = state.foodBasket.filter(product => product.food.title !== action.payload.food.title)
        product.weigthFactor += action.payload.weigthFactor
        return {
          ...state,
          foodBasket: [...newBasket, product]
        }
      }
      return {
        ...state,
        foodBasket: [...state.foodBasket, action.payload]
      }
    case CREATE_DAY_BASKET:
      const newDayBasket = {
        date: `${action.payload.date.day}-${action.payload.date.month}`,
        foods: action.payload.foodItems
      }
      if (state.dailyBaskets.filter(item => item.date === `${action.payload.date.day}-${action.payload.date.month}`).length > 0) {
        const filteredDayBaskets =
          state.dailyBaskets.filter(item => item.date !== `${action.payload.date.day}-${action.payload.date.month}`)
        return {
          ...state,
          dailyBaskets: [...filteredDayBaskets, newDayBasket]
        }
      }
      else {
        return {
          ...state,
          dailyBaskets: [...state.dailyBaskets, newDayBasket]
        }
      }
    case CREATE_EMPTY_DAY_BASKET:
      if (state.dailyBaskets.filter(item => item.date === `${action.payload.day}-${action.payload.month}`).length === 0) {
        const emptyDayBasket = {
          date: `${action.payload.day}-${action.payload.month}`,
          foods: [] as foodItemType[]
        }
        return {
          ...state,
          dailyBaskets: [...state.dailyBaskets, emptyDayBasket]
        }
      }
    case CLEAR_FOOD_BUSKET:
      return {
        ...state,
        foodBasket: []
      }
    case SET_CALORIE_CAPACITY:
      if (state.dailyCalories.filter(item => item.date === `${action.payload.date.day}-${action.payload.date.month}`).length === 0) {
        const emptyDayCalories = {
          date: `${action.payload.date.day}-${action.payload.date.month}`,
          calories: 0
        }
        state.dailyCalories = [...state.dailyCalories, emptyDayCalories]
      }
      const targetDay = state.dailyCalories.find(item => item.date === `${action.payload.date.day}-${action.payload.date.month}`)
      const newTargetDay = {
        date: `${action.payload.date.day}-${action.payload.date.month}`,
        calories: targetDay.calories + action.payload.calories
      }
      const restDays = state.dailyCalories.filter(item => item.date !== `${action.payload.date.day}-${action.payload.date.month}`)
      return {
        ...state,
        dailyCalories: [...restDays, newTargetDay]
      }
    case NULL_CALORIE_CAPACITY:
      const targetDate = state.dailyCalories.find(item => item.date === `${action.payload.day}-${action.payload.month}`)
      targetDate.calories = 0
      const restDates = state.dailyCalories.filter(item => item.date !== `${action.payload.day}-${action.payload.month}`)
      return {
        ...state,
        dailyCalories: [...restDates, targetDate]
      }
    case CLEAR_FOOD_STATE:
      return {
        ...initialState,
        foodBasket: [...state.foodBasket]
      }

    case DELETE_FOOD_FROM_DAY_BASKET:
      const date = `${action.payload.date.day}-${action.payload.date.month}`
      const targetBasket = state.dailyBaskets.find(item => item.date === date)
      console.log(targetBasket)
      const newBasket = {
        date,
        foods: targetBasket.foods.filter(f => f.food !== action.payload.id)
      }
      const newDailyFoodBaskets = state.dailyBaskets.filter(item => item.date !== date)
      return {
        ...state,
        dailyBaskets: [...newDailyFoodBaskets, newBasket]
      }
    case DELETE_FOOD_FROM_BASKET:
      return {
        ...state,
        foodBasket: state.foodBasket.filter(item => item.food.id !== action.payload)
      }
    case DROP_FOODS_STATE_ON_LOGOUT:
      return initialState
    default:
      return state
  }
}

export function foodsLoading() {
  return createAction(FOODS_LOADING, null, null)
}
export function dropFoodStateOnLogout() {
  return createAction(DROP_FOODS_STATE_ON_LOGOUT, null, null)
}
export function deleteFoodFromBasket(id: number) {
  return createAction(DELETE_FOOD_FROM_BASKET, "payload", id)
}
export function deleteFoodFromBasketDay(id: number, date: DayType) {
  return createAction(DELETE_FOOD_FROM_DAY_BASKET, "payload", { id, date })
}
export function cleanDayCalorieContent(date: DayType) {
  return createAction(NULL_CALORIE_CAPACITY, "payload", date)
}
export function createEmptyDayBasket(day: number, month: string) {
  return createAction(CREATE_EMPTY_DAY_BASKET, "payload", { day, month })
}
export function clearFoodBusket() {
  return createAction(CLEAR_FOOD_BUSKET, null, null)
}
export function clearCurrentMonthInfoInFoods() {
  return createAction(CLEAR_FOOD_STATE, null, null)
}
export function addFoodToBasket(food: FoodType, weigthFactor: number) {
  return createAction(ADD_FOOD_TO_BASKET, 'payload', { food, weigthFactor })
}
export function setCalorieCapacity(date: DayType, calories: number) {
  return createAction(SET_CALORIE_CAPACITY, 'payload', { date, calories })
}
export function getCategories(categories: CategoryType[]) {
  return createAction(GET_CATEGORIES, 'payload', categories)
}
export function createDayBasket(date: DayType, foodItems: foodItemType[]) {
  return createAction(CREATE_DAY_BASKET, 'payload', { date, foodItems })
}

type actionsTypeLocal = ReturnType<typeof foodsLoading> | ReturnType<typeof dropFoodStateOnLogout> |
  ReturnType<typeof deleteFoodFromBasket> | ReturnType<typeof deleteFoodFromBasketDay> | ReturnType<typeof cleanDayCalorieContent> |
  ReturnType<typeof createEmptyDayBasket> | ReturnType<typeof clearFoodBusket> | ReturnType<typeof clearCurrentMonthInfoInFoods> |
  ReturnType<typeof addFoodToBasket> | ReturnType<typeof setCalorieCapacity> | ReturnType<typeof getCategories> |
  ReturnType<typeof createDayBasket>

type localThunkType = ThunkType<actionsTypeLocal | errorActionType | successActionType>


export const deleteFoodFromBasketThunk = (id: number, date: DayType): localThunkType => (dispatch, getState) => {
  const foodsForDay =
    getState().foods.dailyBaskets.find((item: dailyBasketType) => item.date === `${date.day}-${date.month}`).foods
  const foodItemsToDelete = foodsForDay.filter((item: foodItemType) => item.food === id)
  let allDeleted = true
  foodItemsToDelete.forEach((item: foodItemType) => {
    axios.delete(`https://caloriecounterapi.herokuapp.com/api/food-items/${item.id}`, addHeaderWithToken(getState))
      .then(() => {
        dispatch(createSuccessMessage('Food Item Was Deleted From Basket'))
      })
      .catch(error => {
        allDeleted = false
        dispatch(errorAC(error.toJSON().message, error.response.status))
      })
  })
  if (allDeleted) {
    dispatch(deleteFoodFromBasket(id))
  }
}

export const setCalorieContent = (date: DayType): localThunkType => (dispatch, getState) => {
  const foodItems =
    getState().foods.dailyBaskets.find((item: dailyBasketType) => item.date === `${date.day}-${date.month}`).foods
  foodItems.forEach((item: foodItemType) => {
    axios.get(`https://caloriecounterapi.herokuapp.com/api/foods/${item.food}`, addHeaderWithToken(getState))
      .then(res => {
        dispatch(setCalorieCapacity(date, +res.data.calorie_content * (item.weight / 100)))
      })
      .catch(error => {
        dispatch(errorAC(error.toJSON().message, error.response.status))
      });
  })
}

export const addFoodToBasketFromDayState = (food: number, weigthFactor: number): localThunkType => dispatch => {
  axios.get(`https://caloriecounterapi.herokuapp.com/api/foods/${food}`)
    .then(res => {
      dispatch(addFoodToBasket(res.data, weigthFactor))
    })
    .catch(error => {
      dispatch(errorAC(error.toJSON().message, error.response.status))
    });
}

export const addFoodToBasketThunk = (food: FoodType, weight: number): localThunkType => (dispatch, getState) => {
  const date = getState().days.dayToAddFoodIn.id
  const body = { date, food: food.id, weight, date_for_search: date.toString() }
  axios
    .post('https://caloriecounterapi.herokuapp.com/api/food-items/', body, addHeaderWithToken(getState))
    .then(() => {
      dispatch(createSuccessMessage('Food Item Was Added To Basket'))
      dispatch(addFoodToBasket(food, weight / 100))
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    });
}

export const getCategoriesThunk = (): localThunkType => dispatch => {
  dispatch(foodsLoading())
  axios
    .get('https://caloriecounterapi.herokuapp.com/api/categories/')
    .then(res => {
      dispatch(getCategories(res.data))
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    });
}

export const getUserFoodItems = (date: DayType): localThunkType => (dispatch, getState) => {
  axios
    .get(`https://caloriecounterapi.herokuapp.com/api/food-items?search=${date.id}`, addHeaderWithToken(getState))
    .then(res => {
      dispatch(createDayBasket(date, res.data))
      dispatch(setCalorieContent(date))
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    })
}

export interface foodItemType {
  id: number
  date: number
  food: number
  weight: number
  date_for_search: string
}

interface dailyBasketType {
  foods: foodItemType[],
  date: string
}

interface dailyCaloriesType {
  calories: number
  date: string
}

interface initialStateType {
  dailyBaskets: dailyBasketType[]
  isLoading: boolean
  categories: CategoryType[],
  foodBasket: foodBasketItemType[],
  dailyCalories: dailyCaloriesType[]
}