import axios from 'axios'

export default class ZWayAPI {
  updateTime = undefined

  authenticate = async params => {
    try {
      const resp = await axios.post('ZAutomation/api/v1/login', params)
      return resp.data
    } catch (e) {
      throw e
    }
  }

  profile = async id => {
    try {
      const resp = await axios.get(`ZAutomation/api/v1/profiles/${id}`)
      return resp.data
    } catch (e) {
      throw e
    }
  }

  addNodeToNetwoek = async () => {
    try {
      const resp = await axios.get('ZWaveAPI/Run/controller.AddNodeToNetwork(1)')
      return resp.data
    } catch (e) {
      throw e
    }
  }

  checkNetworkData = async () => {
    try {
      const resp = await axios.get(`ZWaveAPI/Data/${Date.now()}`)

      return resp.data
    } catch (e) {
      throw e
    }
  }

  checkDevices = async () => {
    const date = new Date()
    const timestamp = this.updateTime || Math.floor(date.getTime() / 1000)

    const headers = {
      isZWAY: true,
    }

    try {
      const resp = await axios.get(`ZAutomation/api/v1/devices?since=${timestamp}`, { headers })
      this.updateTime = resp.data.data.updateTime
      return resp.data
    } catch (e) {
      throw e
    }
  }

  runCommand = async command => {
    try {
      const resp = await axios.get(`ZWaveAPI/Run/${command}`)

      return resp.data
    } catch (e) {
      throw e
    }
  }

  runDeviceCommand = async (deviceId, command) => {
    try {
      const resp = await axios.get(`ZAutomation/api/v1/devices/${deviceId}/command/${command}`)

      return resp.data
    } catch (e) {
      throw e
    }
  }

  fetchDevises = async () => {
    const headers = {
      isZWAY: true,
    }

    try {
      const resp = await axios.get(`ZAutomation/api/v1/devices`, { headers })
      return resp.data
    } catch (e) {
      throw e
    }
  }
}
