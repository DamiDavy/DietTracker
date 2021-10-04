import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import '../styles/categories-and-foods.scss';
import { getCategories } from '../reducers/foods'

export function Category() {

  const categoryParam = useParams().category

  const category = useSelector(state => state.foods.categories.find(c => c.title === categoryParam))

  const dispatch = useDispatch()

  useEffect(() => {
    if (!category) {
      dispatch(getCategories())
    }
  }, [category])

  return (
    <div className="route-container">
      <div className="foods-categories-container">
        <h2>{category ? category.title : null}</h2>
        <div className="categories-container">
          {category ? category.foods.map(food => <div key={food.id}
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
