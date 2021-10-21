import * as React from 'react'
import { useEffect, useRef } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { useDispatch, useSelector, Provider } from 'react-redux'
import * as Alert from 'react-alert'
import { useAlert, positions, Provider as AlertProvider } from 'react-alert'

import { Login } from './auth/Login'
import { Register } from './auth/Register'
import { PrivateRoute } from './common/PrivateRoute'
import { Header } from './Header'
import { Calendar } from './private/Calendar'
import { Search } from './Search'
import { Category } from './Category'
import { Food } from './Food'
import { Categories } from './Categories'
import { FoodBasket } from './FoodBasket'
import { CalorieIntake } from './CalorieIntake'
import { NotFound } from './NotFound'

import { loadUser } from '../reducers/auth'
import { toggleDropdownVisibility } from '../reducers/search'
import './styles/app.scss'
import './styles/index.scss'

import store from './store'
import { stateType } from './store'
// @ts-ignore 
import foodsimg from '../assets/vegetables.jpg'

const options = {
  position: positions.TOP_CENTER,
  timeout: 3000,
  offset: '30px'
}

const AlertTemplate = ({ style, options, message }: Alert.AlertComponentPropsWithStyle) => (
  <div style={style} className={`alert-${options.type}`}>
    {message}
  </div>
)

export function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUser())
  }, [])

  const successMessage = useSelector((state: stateType) => state.success.message)
  const errorMessage = useSelector((state: stateType) => state.errors.message)

  const alert = useAlert()

  useEffect(() => {
    if (successMessage) {
      alert.show(successMessage, {
        type: 'success',
      })
    }
  }, [successMessage])

  useEffect(() => {
    if (errorMessage) {
      alert.show(errorMessage, {
        type: 'error',
      })
    }
  }, [errorMessage])

  const main = useRef<HTMLElement | null>(null);
  const aside = useRef<HTMLElement | null>(null);

  useEffect(() => {
    console.log(main)
  }, [main])

  function hideDropdowns() {
    dispatch(toggleDropdownVisibility(false))
  }

  return (
    <div onClick={hideDropdowns} className="main-app-container">
      <Header aside={aside} main={main} />
      <img src={foodsimg} className="back-img" />
      <div className="background-opacity"></div>
      <Search aside={aside} main={main} />
      <div className="flex-cont-for-main-and-basket">
        <main ref={main}>
          <Switch>
            <Route exact path="/" component={Categories} />
            <PrivateRoute exact path="/app/days" component={Calendar} aside={aside} main={main} />
            <Route exact path="/app/category/:category" component={Category} />
            <Route exact path="/app/food/:food"
              render={(props) => (
                <Food {...props} aside={aside} main={main} />
              )}
            />
            <Route exact path="/app/calorie-intake" component={CalorieIntake} />
            <Route exact path="/app/login" component={Login} />
            <Route exact path="/app/register" component={Register} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <aside ref={aside}>
          <FoodBasket aside={aside} main={main} />
        </aside>
      </div>
      <footer className="footer">
        <div className="footer-text">by DamiDami</div>
        <div className="footer-img-info">img: health.harvard.edu</div>
      </footer>
    </div >
  )
}

export const AppWithWrap = () => {
  return (
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertProvider>
    </Provider>
  )
}