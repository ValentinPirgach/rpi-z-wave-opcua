import * as types from 'constants/ActionTypes'

const initialState = {
  devices: [],
  selected: {},
}

export default function device(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_DEVICES_REQUEST:
      return {
        ...state,
        isFetching: true,
      }

    case types.FETCH_DEVICES_FAILED:
      return {
        ...state,
        isFetching: false,
      }

    case types.FETCH_DEVICES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        devices: action.payload,
      }

    case types.SELECT_DEVICE_REQUEST:
      return {
        ...state,
        isFetching: true,
      }

    case types.SELECT_DEVICE_FAILED:
      return {
        ...state,
        isFetching: false,
      }

    case types.SELECT_DEVICE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        selected: action.payload,
      }

    default:
      return state
  }
}
