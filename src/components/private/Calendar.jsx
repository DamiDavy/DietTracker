import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useDispatch, useSelector } from 'react-redux'
import { clearCurrentMonthInfoInDays, createOrGetDay, searchDays, setCalendarIsRendered } from '../../reducers/days'
import { Day } from './Day'
import { clearCurrentMonthInfoInFoods, clearFoodBusket, createEmptyDayBasket } from '../../reducers/foods'
import '../../styles/calendar.scss'

const weekDays = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']
export const monthsTitles = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december']

const weekDayInFormat = (day) => {
  if (day === 0) return 6
  else return day - 1
}

const lastMonthDay = (year, month) => {
  const firstDay = new Date(year, month)
  firstDay.setMonth(firstDay.getMonth() + 1)
  firstDay.setDate(0)
  return firstDay.getDate()
}

const getMonthFirstDayInWeek = (year, month) => {
  const firstDay = new Date(year, month)
  return weekDayInFormat(firstDay.getDay())
}

export const monthInFormat = (month) => {
  return month + 1 < 10 ? `0${month + 1}` : month + 1
}

export function Calendar({ aside, main }) {

  const dispatch = useDispatch()

  const now = new Date()

  const calendarIsRendered = useSelector(state => state.days.calendarIsRendered)

  useEffect(() => {
    if (!calendarIsRendered) {
      // dispatch(createOrGetDay(now.getDate(), monthInFormat(now.getMonth()), now.getFullYear()))
      dispatch(setCalendarIsRendered())
    }
  }, [])

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  function showBasket(day, month, year) {
    dispatch(createOrGetDay(day, month, year))
    dispatch(createEmptyDayBasket({ day, month }))
    dispatch(clearFoodBusket())
    aside.current.style.display = 'block';
    if (window.innerWidth <= 700) {
      main.current.style.display = 'none';
    }
  }

  const [monthFirstWeekDay, setMonthFirstWeekDay] =
    useState(getMonthFirstDayInWeek(year, month))

  useEffect(() => {
    setMonthFirstWeekDay(getMonthFirstDayInWeek(year, month))
    dispatch(searchDays(year, monthInFormat(month)))
  }, [year, month])

  const showPreviousMonth = () => {
    dispatch(clearCurrentMonthInfoInFoods())
    dispatch(clearCurrentMonthInfoInDays())
    setMonth(prev => {
      if (prev === 0) {
        setYear(y => y - 1)
        return 11
      }
      return prev - 1
    })
  }

  const showNextMonth = () => {
    dispatch(clearCurrentMonthInfoInFoods())
    dispatch(clearCurrentMonthInfoInDays())
    setMonth(prev => {
      if (prev === 11) {
        setYear(y => y + 1)
        return 0
      }
      return prev + 1
    })
  }
  const days = useSelector(state => state.days.days)

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const legend = useRef(null)

  const legendObject = {
    "blue-day": "less than 70%",
    "green-day": "70-90%",
    "yellow-day": "90-105%",
    "orange-day": "105-120%",
    "red-day": "more than 120%"
  }

  return (
    <div className="route-container">
      <div className="foods-categories-container">
        <h2>Calories Calendar</h2>
        <div className="calendar-container">
          <button className="color-info-link" onClick={() => legend.current.scrollIntoView(top)}>?
            <div className="color-info-tooltip">what day color means</div>
          </button>
          <div className="month-title-and-bottons-container">
            <button onClick={showPreviousMonth} className="switch-month-btn">&#8249;</button>
            <h4>{`${capitalize(monthsTitles[month])} ${year}`}</h4>
            <button onClick={showNextMonth} className="switch-month-btn">&#8250;</button>
          </div>
          <div className="calendar-grid">
            {weekDays.map(day => <div className="week-day-title" key={day}>{day}</div>)}
            {monthFirstWeekDay !== 0 &&
              [...Array(monthFirstWeekDay).keys()].map(() => <div
                key={`empty${uuidv4()}`}></div>)}

            {[...Array(lastMonthDay(year, month)).keys()]
              .map((index) =>
                <Day key={`num${uuidv4()}`} num={index + 1} days={days}
                  showBasket={showBasket} month={month} year={year} />)}
          </div>
          <div className="legend-for-calendar" ref={legend}>
            {Object.keys(legendObject).map(key => <>
              <div className={`legend-day ${key}`}></div>
              <span className="legend-text">
                {`calorie intake is ${legendObject[key]} of recommended`}</span><br />
            </>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}
