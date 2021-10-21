import * as React from 'react'
import { render } from 'react-dom'

import { AppWithWrap } from './components/App'

const Root = () => (
  <AppWithWrap />
)

render(<Root />, document.getElementById('root'))