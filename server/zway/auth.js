import ZWayAPI from './api'
import User from '../models/User'

const api = new ZWayAPI()

export default class ZWayAuth {
  constructor() {
    return this.init()
  }

  async init() {
    return Promise.all([await this.authenticate()])
  }

  authenticate = async () => {
    const credentials = {
      login: 'admin',
      password: '123123123',
    }

    const user = await User.findOne({ login: credentials.login })

    let unauthtorized = false

    try {
      await api.profile(user.id)
    } catch (e) {
      unauthtorized = e.response.status === 401

      console.log('unauthtorized >>>', unauthtorized)
    }

    if (!user.sid || unauthtorized) {
      const auth = await api.authenticate(credentials)
      const updated = await User.findByIdAndUpdate(user._id, auth.data)
      return updated
    }

    return user
  }
}
