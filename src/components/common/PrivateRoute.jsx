import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

export const PrivateRoute = ({ component: Component, ...rest }) => {

  const auth = useSelector(state => state.auth)

  return <Route {...rest}
    render={props => {
      if (auth.isLoading) {
        return <h2>Loading...</h2>
      } else if (!auth.isAuth) {
        return <Redirect to='/app/login' />
      } else {
        return <Component {...props} {...rest} />
      }
    }}
  />
}
