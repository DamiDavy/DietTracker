import React, { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getCategories } from '../reducers/foods'
import '../styles/categories-and-foods.scss';
import preloader from '../assets/preloader.gif'

export const Categories = React.memo(function Categories() {

  const dispatch = useDispatch()

  const categories = useSelector(state => state.foods.categories, shallowEqual)

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
            {categories ? categories.map(category => <div key={category.id} className="category-container">
              <Link to={`/app/category/${category.title}`} className="category-link">
                <h4>{category.title}</h4>
              </Link>
              <img src={category.image} />
            </div>) : null}
          </div>}
      </div>
    </div >
  )
})
