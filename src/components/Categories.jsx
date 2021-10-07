import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getCategories } from '../reducers/foods'
import '../styles/categories-and-foods.scss';
import preloader from '../assets/preloader.gif'

export default function Categories() {

  const dispatch = useDispatch()

  const categories = useSelector(state => state.foods.categories)

  useEffect(() => {
    dispatch(getCategories())
  }, [])

  const isLoading = useSelector(state => state.foods.isLoading)

  return (
    <div className="route-container">
      <div className="foods-categories-container">
        <h2>Categories</h2>
        {isLoading ? <img className="animated-gif" src={preloader} /> :
          <div className="categories-container">
            {categories.map(category => <div key={category.id} className="category-container">
              <Link to={`/app/category/${category.title}`} className="category-link">
                <h4>{category.title}</h4>
              </Link>
              <img src={category.image} />
            </div>)}
          </div>}
      </div>
    </div >
  )
}
