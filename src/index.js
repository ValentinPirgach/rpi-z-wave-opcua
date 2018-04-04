import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from 'store'
import Routes from 'routes'
import 'styles/global-styles'
import registerServiceWorker from 'utils/registerServiceWorker'
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://raspberrypi.local';
axios.defaults.headers.common.ZWAYSession = process.env.REACT_APP_AUTH_SESSION;

render(
  <Provider store={configureStore()}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
