import { useEffect, useMemo } from 'react'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  addFoodToBasketFromDayState, cleanDayCalorieContent, deleteFoodFromBasket,
  deleteFoodFromBasketDay, deleteFoodFromBasketThunk, setCalorieContent, foodItemType
} from '../reducers/foods'
import { monthsTitles } from './private/Calendar'
import './styles/_food-basket.scss'
import { toggleBusketVisibility } from './common/toggleBusketVisibility'

import { FoodType } from '../reducers/search'
import { RefObjectsAsProps } from './private/Calendar'
import { stateType } from './store'

function nutrientsAndCaloriesSum(content: string) {
  const key = `${content}_content` as keyof FoodType
  return function (a: number, b: foodBasketItemType) {
    return +a + (+b.food[key] * +b.weigthFactor)
  }
}

export const FoodBasket: React.FC<RefObjectsAsProps> = ({ aside, main }) => {

  const basketDate = useSelector((state: stateType) => state.days.dayToAddFoodIn)

  const dispatch = useDispatch()

  const basket = useSelector((state: stateType) => state.foods.foodBasket)

  const basketContent =
    useSelector((state: stateType) => state.foods.dailyBaskets.find((item: dailyBasketItem) => item.date === dateAsKey(basketDate)))

  const isAuth = useSelector((state: stateType) => state.auth.isAuth)

  function dateAsKey(basketDate: dateType) {
    if (basketDate) {
      return `${basketDate.day}-${basketDate.month}`
    }
  }

  useEffect(() => {
    if (basketDate && isAuth && basketContent) {
      basketContent.foods.forEach((item: foodItemType) => dispatch(addFoodToBasketFromDayState(item.food, item.weight / 100)))
    }
  }, [isAuth, basketDate])

  const basketDateInformat = useMemo(() => {
    if (basketDate) {
      return `${basketDate.day} ${monthsTitles[+basketDate.month - 1]} ${basketDate.year} `
    }
  }, [basketDate])

  function deleteFood(id: number, element: HTMLElement) {
    element.parentElement.style.animationPlayState = 'running'
    setTimeout(() => {
      if (isAuth && basketDate) {
        dispatch(deleteFoodFromBasketThunk(id, basketDate))
        dispatch(deleteFoodFromBasketDay(id, basketDate))
        dispatch(cleanDayCalorieContent(basketDate))
        dispatch(setCalorieContent(basketDate))
      } else {
        dispatch(deleteFoodFromBasket(id))
      }
    }, 2000)
  }

  function hideBasketOnSmallScreen() {
    if (window.innerWidth <= 700) {
      aside.current.style.display = 'none';
      main.current.style.display = 'block';
    }
  }

  return (
    <div className="food-basket-container">
      <div className="basket-indexes-and-date-container-sticky">
        <h3>Food Basket</h3>
        <h4>{basketDateInformat}</h4>
        <div className="food-composition-indexes">
          <p>Calories: {Math.round(basket.reduce(nutrientsAndCaloriesSum('calorie'), 0))}kcal</p>
          <p>Protein: {basket.reduce(nutrientsAndCaloriesSum('protein'), 0).toFixed(1)}g</p>
          <p>Fat: {basket.reduce(nutrientsAndCaloriesSum('fat'), 0).toFixed(1)}g</p>
          <p>Carbohydrate: {basket.reduce(nutrientsAndCaloriesSum('carbohydrate'), 0).toFixed(1)}g</p>
          <p>Weigth: {Math.round(basket.reduce((a, b) => a + (b.weigthFactor * 100), 0))}g</p>
          <button className="hide-busket-button"
            onClick={() => toggleBusketVisibility(aside, main)}>&#215;</button>
        </div>
      </div>
      <div className="food-items-container">
        {basket.length !== 0 ? basket.map(product =>
          <div className="item-container" key={product.food.id}>
            <h6>{product.food.title}</h6>
            <img src={product.food.image} />
            <button className="delete-item-from-basket-button"
              onClick={e => deleteFood(product.food.id, e.currentTarget)}>&#215;</button>
            <div className="item-weight-info">{Math.round(product.weigthFactor * 100)}g</div>
            <div className="item-calories-info">
              {Math.round(product.weigthFactor * product.food.calorie_content)}kcal
            </div>
          </div>) : <div className="empty-basket">
          <p>No foods in basket</p>
          {(isAuth && !basketDate) ? <p>Please, select the date in <Link onClick={hideBasketOnSmallScreen}
            to="/app/days" className="link-to-choose-day-in-calendar">Calendar</Link>
          </p> : null}
        </div>}
        <div className="item-container-empty" key={`empty`}> </div>
      </div>
    </div>
  )
}

export interface foodBasketItemType {
  weigthFactor: number,
  food: FoodType
}
interface dateType {
  id: number
  day: string
  month: string
  year: string
  user: number
}
interface dailyBasketItem {
  date: string
  foods: foodItemType[]
}