import React, { useEffect, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../reducers/auth'
import { getUserRecomendedIntakeThunk } from '../reducers/intake'
import { Link, NavLink } from 'react-router-dom'
import '../styles/_header.scss';
import { toggleBusketVisibility, toggleBusketVisibilityForWideScreenAndCalendar }
  from './common/toggleBusketVisibility'
import { DROP_CALENDAR_STATE_ON_LOGOUT } from '../reducers/days'
import { DROP_FOODS_STATE_ON_LOGOUT } from '../reducers/foods'

export function Header({ aside, main }) {

  const dispatch = useDispatch()

  const isAuth = useSelector(state => state.auth.isAuth)
  const user = useSelector(state => state.auth.user)
  const intake = useSelector(state => {
    if (state.intake.intake) {
      return state.intake.intake.daily_calorie_intake
    }
  })

  useEffect(() => {
    if (isAuth) {
      dispatch(getUserRecomendedIntakeThunk())
    }
  }, [isAuth, dispatch])

  const categoriesLink = useRef(null);
  const diaryLink = useRef(null);
  const intakeLink = useRef(null);
  const authLinks = useRef(null);
  const opacityContainer = useRef(null);

  function hideHeaderDropDown() {
    categoriesLink.current.style.display = 'none';
    diaryLink.current.style.display = 'none';
    intakeLink.current.style.display = 'none';
    authLinks.current.style.display = 'none';
    opacityContainer.current.style.display = 'none';
  }

  function toggleLinksVisibility() {
    if (categoriesLink.current.style.display === 'none') {
      categoriesLink.current.style.display = 'block';
      diaryLink.current.style.display = 'block';
      intakeLink.current.style.display = 'block';
      authLinks.current.style.display = 'block';
      opacityContainer.current.style.display = 'block';
    } else {
      hideHeaderDropDown()
    }
  }

  function closeBaskeAndHeaderDropDown() {
    if (window.innerWidth <= 700) {
      hideHeaderDropDown()
      aside.current.style.display = 'none'
      main.current.style.display = 'block'
    }
  }

  function logoutAndDropState() {
    dispatch(logoutUser())
    dispatch({ type: DROP_CALENDAR_STATE_ON_LOGOUT })
    dispatch({ type: DROP_FOODS_STATE_ON_LOGOUT })
    if (window.innerWidth <= 700) {
      hideHeaderDropDown()
      aside.current.style.display = 'none'
      main.current.style.display = 'block'
    }
  }

  const basket = useSelector(state => state.foods.foodBasket)

  const guestButtons = <>
    <div><NavLink className="header-link" onClick={closeBaskeAndHeaderDropDown} to={'/app/login'}
      activeStyle={{ fontWeight: "bold" }}>
      Login</NavLink></div>
    <div className="header-text">Or</div>
    <div><NavLink className="header-link" onClick={closeBaskeAndHeaderDropDown} to={'/app/register'}
      activeStyle={{ fontWeight: "bold" }}>
      Register</NavLink></div>
  </>

  const authButtons = <>
    <div className="user-info">
      {user ? <>as <span className="username-in-header">{user.username}</span></> : null}<br />
      {intake ? <span className="kcal-in-header">({intake} kcal)</span> : null}
    </div>
    <button className="logout-button" onClick={logoutAndDropState}>Logout</button>
  </>

  return (<>
    <div className="cover-for-dropdown-closing-onclick" ref={opacityContainer}
      onClick={() => hideHeaderDropDown()}></div>
    <header className="header-container">
      <div className="flex-for-small">
        <Link className="header-link" to="/"><h2 className="header"
          onClick={closeBaskeAndHeaderDropDown}>Food Diary</h2></Link>
        <div className="toggle-basket-button">
          <Link className="header-link" to="#"
            onClick={() => toggleBusketVisibility(aside, main)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              fill="currentColor" className="bi bi-basket" viewBox="0 0 16 16">
              <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
            </svg>
          </Link>
          <span className="basket-foods-number">{basket.length}</span>
        </div>

        <div className="toggle-menu-btn">
          <Link className="header-link" to="#"
            onClick={toggleLinksVisibility}>&#9776;</Link>
        </div>

      </div>

      <div>
        <NavLink className="header-link link-visible-for-wide"
          to="/" ref={categoriesLink}
          onClick={closeBaskeAndHeaderDropDown}>Categories</NavLink>
      </div>
      <div>
        <NavLink className="header-link link-visible-for-wide" to="/app/days" ref={diaryLink}
          activeStyle={{ fontWeight: "bold" }}
          onClick={closeBaskeAndHeaderDropDown}>Diary</NavLink>
      </div>
      <div>
        <NavLink className="header-link link-visible-for-wide" to="/app/calorie-intake" ref={intakeLink}
          activeStyle={{ fontWeight: "bold" }}
          onClick={closeBaskeAndHeaderDropDown}>Calorie Intake</NavLink>
      </div>

      <div>
        <Link className="header-link link-visible-for-wide" to="#"
          onClick={() => toggleBusketVisibilityForWideScreenAndCalendar(aside)}>
          Basket
          <span className="basket-foods-number">{basket.length}</span>
        </Link>
      </div>

      <div className="auth-buttons-flex-container" ref={authLinks}>
        <div className="flex-for-small">{isAuth ? authButtons : guestButtons}</div>
      </div>
    </header>
  </>
  )
}
