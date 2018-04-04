import { combineReducers } from 'redux'
import counter from './counter'
import device from './device'

const rootReducer = combineReducers({
  counter,
  device
})

export default rootReducer
