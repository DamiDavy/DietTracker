import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { deleteDayFromLoaded } from '../reducers/days'
import { addFoodToBasket, foodsSearch, addFoodToBasketThunk, clearDayCalorieCapacity, updateDayCalorieContent, getUserFoodItems, cleanDayCalorieContent, setCalorieContent } from '../reducers/foods'

export function Food({ aside, main }) {

  const [weight, setWeight] = useState(100)

  const weigthFactor = useMemo(() => {
    return weight / 100
  }, [weight])

  const foodParam = useParams().food

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(foodsSearch(foodParam))
  }, [])

  const food = useSelector(state => state.foods.foods[0])
  const isAuth = useSelector(state => state.auth.isAuth)

  let history = useHistory();

  const basketDate = useSelector(state => state.days.dayToAddFoodIn)

  function addToBasket(food, weigthFactor) {
    if (isAuth) {
      dispatch(addFoodToBasketThunk(food, +weight))
      dispatch(getUserFoodItems(basketDate))
      dispatch(cleanDayCalorieContent(basketDate))
    } else {
      dispatch(addFoodToBasket(food, weigthFactor))
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

  if (!food) return null

  return (
    <div className="route-container">
      <div className="unified-container">
        <h2>{food.title}</h2>
        <img className="detail-food-info-img" src={food.image} />
        <pre>{`
${Math.round(food.calorie_content * weigthFactor)} calories
${Math.round(food.protein_content * weigthFactor)} protein
${Math.round(food.fat_content * weigthFactor)} fat
${Math.round(food.carbohydrate_content * weigthFactor)} carbohydrate`}
        </pre>
        <div className="food-weight-form-container">
          <input type="number" value={weight}
            className="weight-input" onChange={e => setWeight(e.target.value)} /><span>g</span>
          <div className="btn-container" >
            <button className="add-food-btn" onClick={() => addToBasket(food, weigthFactor)}>Add To Basket</button>
          </div>
        </div>
      </div>
    </div>
  )
}
