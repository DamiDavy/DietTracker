import * as React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

import { registerUser } from '../../reducers/auth'
import '../styles/_form.scss'

import { stateType } from '../store'

export const Register = () => {

  const isAuth = useSelector((state: stateType) => state.auth.isAuth)

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [email, setEmail] = useState('')

  const [error, setError] = useState('')

  const dispatch = useDispatch()

  const submitRegistrationForm = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(registerUser(login, email, password))
    e.preventDefault()
  }

  const inputValidationOnBlur = (e: React.FocusEvent<HTMLInputElement>, type: string, title: string) => {
    if (type.length < 4) {
      setError(`${title} must contain at least four letters`)
      e.target.style.border = '2px solid #bf2c36'
    }
  }

  const inputValidationOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, type: string, title: string) => {
    if (type.length > 3) {
      setError('')
      e.currentTarget.style.border = '1px solid gray'
    }
  }

  const equalityPasswordsValidation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (password !== passwordRepeat) {
      setError('passwords are not equal')
      e.currentTarget.style.border = '2px solid #bf2c36'
    }
    else {
      setError('')
      e.currentTarget.style.border = '1px solid gray'
    }
  }

  const re = /^[^@]+@[^@]+.[^@]+$/
  const emailValidationOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!re.test(email)) {
      setError('invalid email address')
      e.target.style.border = '2px solid #bf2c36'
    }
  }
  const emailValidationOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (re.test(email)) {
      setError('')
      e.currentTarget.style.border = '1px solid gray'
    }
  }

  if (isAuth) return <Redirect to="/app/days" />

  return (
    <div className="route-container">
      <div className="unified-container">
        <h2>Registration</h2>
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
          <input value={passwordRepeat}
            className="login-reg-form-input"
            onChange={(e) => setPasswordRepeat(e.target.value)}
            type='password'
            placeholder='repeat password'
            onKeyUp={e => equalityPasswordsValidation(e)} /><br />
          <input value={email}
            className="login-reg-form-input"
            onChange={(e) => setEmail(e.target.value)}
            placeholder='email'
            onKeyUp={e => emailValidationOnKeyUp(e)}
            onBlur={e => emailValidationOnBlur(e)} /><br />
        </form>
        <p className="form-error">{error}</p>

        <p>
          {login.length < 4 || password.length < 4 || passwordRepeat !== password || email.length < 5 ?
            <button className="login-reg-submit-btn-disabled">Register</button> :
            <button onClick={submitRegistrationForm} className="login-reg-submit-btn">
              Register
            </button>}
        </p>
        <p>Or</p>
        <p>
          <Link to='/app/login'>
            <button className="login-reg-submit-btn">Login</button>
          </Link>
        </p>
      </div>
    </div>
  )
}