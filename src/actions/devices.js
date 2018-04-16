import * as types from 'constants/ActionTypes'
import { createAction } from 'redux-actions'
import axios from 'axios'

const fetchDevicesRequest = createAction(types.FETCH_DEVICES_REQUEST)
const fetchDevicesSuccess = createAction(types.FETCH_DEVICES_SUCCESS)
const fetchDevicesFailed = createAction(types.FETCH_DEVICES_FAILED)

const selectDeviceRequest = createAction(types.SELECT_DEVICE_REQUEST)
const selectDeviceSuccess = createAction(types.SELECT_DEVICE_SUCCESS)
const selectDeviceFailed = createAction(types.SELECT_DEVICE_FAILED)

const selectTagRequest = createAction(types.SELECT_TAG_REQUEST)
const selectTagSuccess = createAction(types.SELECT_TAG_SUCCESS)
const selectTagFailed = createAction(types.SELECT_TAG_FAILED)

export function fetchDevices() {
  return async dispatch => {
    dispatch(fetchDevicesRequest())

    try {
      const resp = await axios.get(`api/devices`)
      return dispatch(fetchDevicesSuccess(resp.data))
    } catch (e) {
      return dispatch(fetchDevicesFailed())
    }
  }
}

export function selectDevice(device) {
  return async dispatch => {
    dispatch(selectDeviceRequest())

    try {
      const resp = await axios.get(`api/devices/${device.nodeId}`)
      return dispatch(selectDeviceSuccess(resp.data))
    } catch (e) {
      return dispatch(selectDeviceFailed())
    }
  }
}

export function selectTag(tag) {
  return async dispatch => {
    dispatch(selectTagRequest())

    try {
      const resp = await axios.get(`api/tags/${tag.nodeId}`)
      return dispatch(selectTagSuccess(resp.data))
    } catch (e) {
      return dispatch(selectTagFailed())
    }
  }
}
