import { useState } from 'react'
import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { foodsSearch, toggleDropdownVisibility } from '../reducers/search'
import { RefObjectsAsProps } from './private/Calendar'
import { stateType } from './store'
import { FoodType } from '../reducers/search'
import './styles/search-form.scss'

export const Search: React.FC<RefObjectsAsProps> = ({ aside, main }) => {
  const [title, setTitle] = useState('')

  const foods = useSelector((state: stateType) => state.search.foods)
  const dropDownIsVisible = useSelector((state: stateType) => state.search.dropDownIsVisible)
    && (foods && foods.length)

  const dispatch = useDispatch()
  function showResultsDropDown() {
    if (title.length < 2) {
      dispatch(toggleDropdownVisibility(false))
      return
    }
    dispatch(foodsSearch(title))
    dispatch(toggleDropdownVisibility(true))
  }

  function onClickFoodDetailLink() {
    if (window.innerWidth <= 700) {
      aside.current.style.display = 'none'
    }
    main.current.style.display = 'block'
    setTitle('')
  }

  return (
    <>
      <div className="form-container">
        <form>
          <div className="food-serch-input-container">
            <input type="text" className={dropDownIsVisible ? "food-search-input-with-dropdown" :
              "food-search-input"}
              value={title}
              placeholder="enter food title"
              onChange={e => setTitle(e.target.value)}
              onKeyUp={showResultsDropDown} />
            <button type="button" className="clear-input"
              onClick={() => setTitle('')}>&#215;</button>
            {dropDownIsVisible ? <div className="search-dropdown">
              {foods.map((food: FoodType) => <div key={food.id}><Link className="search-result-link"
                onClick={onClickFoodDetailLink}
                to={`/app/food/${food.title}`}>{food.title}</Link></div>)}
            </div> : null}
          </div>
        </form>
      </div>
    </>
  )
}
