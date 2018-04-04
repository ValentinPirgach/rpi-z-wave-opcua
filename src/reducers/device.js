import * as types from 'constants/ActionTypes'

const initialState = {
  metrics: {
    level: 0,
    probeTitle: '',
    scaleTitle: ''
  }
}

export default function device(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_DEVICE_SUCCESS:
      return {...state, ...action.payload.data}

    default:
      return state
  }
}
