import axios from 'axios'
import { addHeaderWithToken } from './auth'

import { errorAC, GET_ERRORS } from './errors'
import { createSuccessMessage, SET_MESSAGE } from './success'

const GET_FOODS = 'GET_FOODS'
const GET_CATEGORIES = 'GET_CATEGORIES'
const ADD_FOOD_TO_BASKET = 'ADD_FOOD_TO_BASKET'
const TOGGLE_DROPDOWN_VISIBILITY = 'TOGGLE_DROPDOWN_VISIBILITY'
const CREATE_DAY_BASKET = 'CREATE_DAY_BASKET'
const SET_CALORIE_CAPACITY = 'SET_CALORIE_CAPACITY'
const NULL_CALORIE_CAPACITY = 'NULL_CALORIE_CAPACITY'

const CLEAR_FOOD_STATE = 'CLEAR_FOOD_STATE'
const CLEAR_FOOD_BUSKET = 'CLEAR_FOOD_BUSKET'
const DELETE_FOOD_FROM_BASKET = 'DELETE_FOOD_FROM_BASKET'
const DELETE_FOOD_FROM_DAY_BASKET = 'DELETE_FOOD_FROM_DAY_BASKET'
export const DROP_FOODS_STATE_ON_LOGOUT = 'DROP_FOODS_STATE_ON_LOGOUT'

const initialState = {
  foods: [],
  categories: [],
  foodBasket: [],
  dropDownIsVisible: false,
  calories: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case DROP_FOODS_STATE_ON_LOGOUT:
      return initialState
    case DELETE_FOOD_FROM_BASKET:
      return {
        ...state,
        foodBasket: state.foodBasket.filter(item => item.food.id !== action.payload)
      }
    case CLEAR_FOOD_BUSKET:
      return {
        ...state,
        foodBasket: []
      }
    case CLEAR_FOOD_STATE:
      return {
        ...initialState,
        foodBasket: [...state.foodBasket]
      }
    case TOGGLE_DROPDOWN_VISIBILITY:
      return {
        ...state,
        dropDownIsVisible: action.payload
      }
    case NULL_CALORIE_CAPACITY:
      return {
        ...state,
        calories: {
          ...state.calories,
          [`${action.date.day}-${action.date.month}`]: 0
        }
      }
    case SET_CALORIE_CAPACITY:
      if (state.calories[`${action.date.day}-${action.date.month}`] === undefined) {
        state.calories[`${action.date.day}-${action.date.month}`] = 0
      }
      return {
        ...state,
        calories: {
          ...state.calories,
          [`${action.date.day}-${action.date.month}`]: state.calories[`${action.date.day}-${action.date.month}`]
            + action.payload
        }
      }
    case DELETE_FOOD_FROM_DAY_BASKET:
      return {
        ...state,
        [`${action.date.day}-${action.date.month}`]: state[`${action.date.day}-${action.date.month}`]
          .filter(item => item.food != action.payload)
      }
    case CREATE_DAY_BASKET:
      return {
        ...state,
        [`${action.date.day}-${action.date.month}`]: action.payload
      }
    case GET_FOODS:
      return {
        ...state,
        foods: action.payload
      }
    case GET_CATEGORIES:
      return {
        ...state,
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
    default:
      return state
  }
}

export const deleteFoodFromBasket = (id) => {
  return {
    type: DELETE_FOOD_FROM_BASKET,
    payload: id
  }
}

export const deleteFoodFromBasketDay = (id, date) => ({
  type: DELETE_FOOD_FROM_DAY_BASKET,
  date,
  payload: id
})

export const cleanDayCalorieContent = (date) => {
  return {
    type: NULL_CALORIE_CAPACITY,
    date
  }
}

export const deleteFoodFromBasketThunk = (id, date) => (dispatch, getState) => {
  const foodsForDay = getState().foods[`${date.day}-${date.month}`]
  const foodItemsToDelete = foodsForDay.filter(item => item.food === id)
  let allDeleted = true
  foodItemsToDelete.forEach(item => {
    axios.delete(`/api/food-items/${item.id}`, addHeaderWithToken(getState))
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

export const clearFoodBusket = () => ({ type: CLEAR_FOOD_BUSKET })

export const clearCurrentMonthInfoInFoods = () => ({ type: CLEAR_FOOD_STATE })

export const setCalorieContent = (date) => (dispatch, getState) => {
  const foodItems = getState().foods[`${date.day}-${date.month}`]
  foodItems.forEach(item => {
    axios.get(`/api/foods/${item.food}`)
      .then(res => {
        dispatch({
          type: SET_CALORIE_CAPACITY,
          date,
          payload: (+res.data.calorie_content * (item.weight / 100))
        })
      })
      .catch(error => {
        dispatch(errorAC(error.toJSON().message, error.response.status))
      });
  })
}

export const addFoodToBasket = (food, weigthFactor) => ({
  type: ADD_FOOD_TO_BASKET,
  payload: {
    food,
    weigthFactor
  }
})

export const addFoodToBasketFromDayState = (food, weigthFactor) => dispatch => {
  axios.get(`/api/foods/${food}`)
    .then(res => {
      dispatch({
        type: ADD_FOOD_TO_BASKET,
        payload: {
          food: res.data,
          weigthFactor
        }
      })
    })
    .catch(error => {
      dispatch(errorAC(error.toJSON().message, error.response.status))
    });
}

export const addFoodToBasketThunk = (food, weight) => (dispatch, getState) => {
  const date = getState().days.dayToAddFoodIn.id
  const body = { date, food: food.id, weight, date_for_search: date.toString() }
  axios
    .post('/api/food-items/', body, addHeaderWithToken(getState))
    .then(() => {
      dispatch(createSuccessMessage('Food Item Was Added To Basket'))
      dispatch(addFoodToBasket(food, weight / 100))
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    });
}

export const toggleDropdownVisibility = (bool) => ({
  type: TOGGLE_DROPDOWN_VISIBILITY,
  payload: bool
})

export const getCategories = () => dispatch => {
  axios
    .get('/api/categories/')
    .then(res => {
      dispatch({
        type: GET_CATEGORIES,
        payload: res.data
      })
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    });
}

export const getUserFoodItems = (date) => (dispatch, getState) => {
  axios
    .get(`/api/food-items?search=${date.id}`, addHeaderWithToken(getState))
    .then(res => {
      dispatch({
        type: CREATE_DAY_BASKET,
        payload: res.data,
        date,
        month: date.month
      })
      dispatch(setCalorieContent(date))
    })
    .catch(error => {
      dispatch(errorAC("There Was An Error", error.response.status))
    })
}

export const foodsSearch = title => dispatch => {
  axios
    .get(`/api/foods?search=${title}`)
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