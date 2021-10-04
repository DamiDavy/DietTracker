import React from 'react'
import { render } from 'react-dom'
import { positions, Provider as AlertProvider } from 'react-alert'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.scss';

import store from './store'
import { App } from './components/App'

const options = {
  position: positions.TOP_CENTER,
  timeout: 3000,
  offset: '30px'
}

const AlertTemplate = ({ style, options, message }) => (
  <div style={style} className={`alert-${options.type}`}>
    {message}
  </div>
)

const Root = () => (
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AlertProvider>
  </Provider>
)

render(<Root />, document.getElementById('root'))