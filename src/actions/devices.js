import * as types from 'constants/ActionTypes'
import { createAction } from 'redux-actions'
import axios from 'axios'

const fetchInstancesRequest = createAction(types.FETCH_INSTANCES_REQUEST)
const fetchInstancesSuccess = createAction(types.FETCH_INSTANCES_SUCCESS)
const fetchInstancesFailed = createAction(types.FETCH_INSTANCES_FAILED)

const fetchDevicesRequest = createAction(types.FETCH_DEVICES_REQUEST)
const fetchDevicesSuccess = createAction(types.FETCH_DEVICES_SUCCESS)
const fetchDevicesFailed = createAction(types.FETCH_DEVICES_FAILED)

const fetchDeviceRequest = createAction(types.FETCH_DEVICE_REQUEST)
const fetchDeviceSuccess = createAction(types.FETCH_DEVICE_SUCCESS)
const fetchDeviceFailed = createAction(types.FETCH_DEVICE_FAILED)

export function fetchInstances() {
  return async (dispatch) => {

    dispatch(fetchInstancesRequest())

    try {
      const resp = await axios.get('/ZAutomation/api/v1/instances')
      return dispatch(fetchInstancesSuccess(resp.data))
    } catch (e) {
      return dispatch(fetchInstancesFailed())
    }
  }
}

export function fetchDevices() {
  return async (dispatch) => {

    dispatch(fetchDevicesRequest())

    try {
      const resp = await axios.get(`/ZAutomation/api/v1/devices`)
      return dispatch(fetchDevicesSuccess(resp.data))
    } catch (e) {
      return dispatch(fetchDevicesFailed())
    }
  }
}

export function fetchDevice(id = '') {
  return async (dispatch) => {

    dispatch(fetchDeviceRequest())

    try {
      const resp = await axios.get(`/ZAutomation/api/v1/devices/${id}`)

      return dispatch(fetchDeviceSuccess(resp.data))
    } catch (e) {
      return dispatch(fetchDeviceFailed())
    }
  }
}
