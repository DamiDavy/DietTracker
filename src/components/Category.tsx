import * as React from 'react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import './styles/categories-and-foods.scss'
import { getCategoriesThunk } from '../reducers/foods'
import { FoodType } from '../reducers/search'
import { CategoryType } from './Categories'

import { stateType } from './store'


export function Category() {

  const { category } = useParams<{ category?: string }>();

  const categoryObject =
    useSelector((state: stateType) => state.foods.categories.find((c: CategoryType) => c.title === category))

  const dispatch = useDispatch()

  useEffect(() => {
    if (!categoryObject) {
      dispatch(getCategoriesThunk())
    }
  }, [categoryObject])

  return (
    <div className="route-container">
      <div className="foods-categories-container">
        <h2>{categoryObject ? categoryObject.title : null}</h2>
        <div className="categories-container">
          {categoryObject ? categoryObject.foods.map((food: FoodType) => <div key={food.id}
            className="category-container">
            <Link to={`/app/food/${food.title}`} className="category-link">
              <h4>{food.title}</h4>
            </Link>
            <img src={food.image} />
          </div>) : null}
        </div>
      </div>
    </div>
  )
}
