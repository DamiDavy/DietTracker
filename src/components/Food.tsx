import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'

import { addFoodToBasket, addFoodToBasketThunk, getUserFoodItems, cleanDayCalorieContent } from '../reducers/foods'
import { foodsSearch, FoodType } from '../reducers/search'
import { RefObjectsAsProps } from './private/Calendar'
import { stateType } from './store'

// @ts-ignore 
import preloader from '../assets/preloader.gif'

export const Food: React.FC<RefObjectsAsProps> = ({ aside, main }) => {

  const [weight, setWeight] = useState(100)

  const weigthFactor = useMemo(() => {
    return weight / 100
  }, [weight])

  const { food } = useParams<{ food?: string }>();

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(foodsSearch(food))
  }, [])

  const foodObject = useSelector((state: stateType) => state.search.foods[0])
  const isAuth = useSelector((state: stateType) => state.auth.isAuth)

  const isLoading = useSelector((state: stateType) => state.search.foodIssLoading)
  const basketDate = useSelector((state: stateType) => state.days.dayToAddFoodIn)

  const history = useHistory()

  function addToBasket(foodObject: FoodType, weigthFactor: number) {
    if (isAuth) {
      dispatch(addFoodToBasketThunk(foodObject, +weight))
      dispatch(getUserFoodItems(basketDate))
      dispatch(cleanDayCalorieContent(basketDate))
    } else {
      dispatch(addFoodToBasket(foodObject, weigthFactor))
    }
    if (window.innerWidth <= 700) {
      main.current.style.display = 'none';
      aside.current.style.display = 'block';
    }
    if (isAuth) {
      history.push("/app/days");
    } else {
      history.push("/");
    }
  }

  if (!foodObject) return null

  return (
    <div className="route-container">
      <div className="unified-container">
        {isLoading ? <img className="animated-gif" src={preloader} /> : <>
          <h2>{foodObject.title}</h2>
          <img className="detail-food-info-img" src={foodObject.image} />
          <pre>{`
${Math.round(foodObject.calorie_content * weigthFactor)} calories
${Math.round(+foodObject.protein_content * weigthFactor)} protein
${Math.round(+foodObject.fat_content * weigthFactor)} fat
${Math.round(+foodObject.carbohydrate_content * weigthFactor)} carbohydrate`}
          </pre>
          <div className="food-weight-form-container">
            <input type="number" value={weight}
              className="weight-input"
              onChange={(e: React.FormEvent<HTMLInputElement>) => setWeight(+e.currentTarget.value)} /><span>g</span>
            <div className="btn-container" >
              <button className="add-food-btn" onClick={() => addToBasket(foodObject, weigthFactor)}>Add To Basket</button>
            </div>
          </div></>}
      </div>
    </div>
  )
}
