import * as React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addDayToLoaded, DayType } from '../../reducers/days'
import { getUserFoodItems } from '../../reducers/foods'
import { monthInFormat } from './Calendar'
import '../styles/calendar.scss'

import { stateType } from '../store'

export const Day: React.FC<DayProps> = ({ num, days, showBasket, month, year }) => {

  const dispatch = useDispatch()

  const dayWithfoodItems =
    useSelector((state: stateType) => state.foods.dailyBaskets.find(item => item.date === `${num}-${monthInFormat(month)}`))

  const foodItems = dayWithfoodItems ? dayWithfoodItems.foods : null

  const calorieCapacity =
    useSelector((state: stateType) => state.foods.dailyCalories.find(item => item.date === `${num}-${monthInFormat(month)}`))

  useEffect(() => {
    days.map(date => {
      if (+date.day === num && !loadedDays.includes(num)) {
        dispatch(getUserFoodItems(date))
      }
    })
  }, [])

  const loadedDays = useSelector((state: stateType) => state.days.datesWereLoaded)

  const intake = useSelector((state: stateType) => state.intake.intake)

  useEffect(() => {
    if (foodItems && !loadedDays.includes(num)) {
      dispatch(addDayToLoaded(num))
    }
  }, [foodItems, loadedDays, dispatch])

  function dayColor() {
    const capacity = calorieCapacity ? +calorieCapacity.calories : 0
    const ratio = capacity / +intake
    if (ratio <= 0.9 && ratio > 0.7) {
      return 'green-day'
    }
    else if (ratio > 0.9 && ratio <= 1.05) {
      return 'yellow-day'
    }
    else if (ratio > 1.05 && ratio <= 1.2) {
      return 'orange-day'
    }
    else if (ratio > 1.2) {
      return 'red-day'
    }
    else if (ratio <= 0.7 && ratio !== 0) {
      return 'blue-day'
    }
    return ''
  }

  return (
    <div className={"day-in-month " + dayColor()}>
      <button className="day-in-month-btn"
        onClick={() => showBasket(num, monthInFormat(month), year)}>
        <span>{num}</span>
      </button>
      {(calorieCapacity && calorieCapacity.calories > 0) ? <span className="day-calorie-capacity">
        {Math.round(calorieCapacity.calories)}
      </span> : null}
    </div >
  )
}

interface DayProps {
  num: number,
  days: DayType[],
  showBasket: (day: number, month: string, year: number) => void,
  month: number,
  year: number
}