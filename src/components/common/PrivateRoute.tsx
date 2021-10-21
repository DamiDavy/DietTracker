import * as React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect, RouteProps } from 'react-router-dom'

import { stateType } from '../store'
import { useRefMutableObject } from './toggleBusketVisibility'

export const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, ...rest } = props;

  const auth = useSelector((state: stateType) => state.auth)

  return <Route {...rest}
    render={(routeProps) => {
      if (auth.isLoading) {
        return <h2>Loading...</h2>
      } else if (!auth.isAuth) {
        return <Redirect to='/app/login' />
      } else {
        return <Component {...routeProps} {...rest} />
      }
    }}
  />
}

interface PrivateRouteProps extends RouteProps {
  component: React.FC
  aside?: useRefMutableObject
  main?: useRefMutableObject
}