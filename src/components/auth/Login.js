import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { loginUser } from '../../reducers/auth'
import '../../styles/_form.scss';

export const Login = () => {

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const isAuth = useSelector(state => state.auth.isAuth)

  const dispatch = useDispatch()

  const submitLoginForm = (e) => {
    dispatch(loginUser(login, password))
    e.preventDefault()
  }

  const inputValidationOnBlur = (e, type, title) => {
    if (type.length < 4) {
      setError(`${title} must contain at least four letters`)
      e.target.style.border = '2px solid #bf2c36'
    }
  }

  const inputValidationOnKeyUp = (e, type) => {
    if (type.length > 3) {
      setError('')
      e.target.style.border = '1px solid gray'
    }
  }

  if (isAuth) return <Redirect to="/app/days" />

  return (
    <div className="route-container">
      <div className="unified-container">
        <h2>Login</h2>
        <form onClick={() => setError('')}>
          <input value={login}
            className="login-reg-form-input"
            onChange={(e) => setLogin(e.target.value)}
            placeholder='login'
            onKeyUp={e => inputValidationOnKeyUp(e, login, 'login')}
            onBlur={e => inputValidationOnBlur(e, login, 'login')} /><br />
          <input value={password}
            className="login-reg-form-input"
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='password'
            onKeyUp={e => inputValidationOnKeyUp(e, password, 'password')}
            onBlur={e => inputValidationOnBlur(e, password, 'password')} /><br />
        </form>
        <p className="form-error">{error}</p>
        <p>
          {login.length < 4 || password.length < 4 ?
            <button className="login-reg-submit-btn-disabled">Login</button> :
            <button onClick={submitLoginForm} className="login-reg-submit-btn">
              Login
            </button>}
        </p>

        <p>Or</p>
        <p>
          <Link to='/app/register'>
            <button className="login-reg-submit-btn">Register</button>
          </Link>
        </p>
      </div>
    </div>
  )
}