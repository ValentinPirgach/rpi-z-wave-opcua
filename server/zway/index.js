/* eslint no-unused-vars: 0 */
import axios from 'axios'
import ZWayAuth from './auth'
import ZWay from './zway'

const ZWayAuthInstance = new ZWayAuth()

ZWayAuthInstance.then(resp => {
  const user = resp[0]

  axios.interceptors.request.use(config => ({
    ...config,
    headers: {
      ...config.headers,
      Cookie: `ZWAYSession=${user.sid}`,
      ZWAYSession: user.sid,
    },
  }))

  const ZWayInstance = new ZWay(user)
})
