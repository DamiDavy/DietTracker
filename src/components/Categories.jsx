import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getCategories } from '../reducers/foods'
import '../styles/categories-and-foods.scss';

export default function Categories() {

  const dispatch = useDispatch()

  const categories = useSelector(state => state.foods.categories)

  useEffect(() => {
    dispatch(getCategories())
  }, [])

  return (
    <div className="route-container">
      <div className="foods-categories-container">
        <h2>Categories</h2>
        <div className="categories-container">
          {categories
            .map(category => <div key={category.id} className="category-container">
              <Link to={`/app/category/${category.title}`} className="category-link">
                <h4>{category.title}</h4>
              </Link>
              <img src={category.image} />
            </div>)}
        </div>
      </div>
    </div >
  )
}
