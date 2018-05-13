import ZWayAPI from './api'
import DeviceService from '../services/device'
// import addDevices from '../opc-ua/addDevices'

const api = new ZWayAPI()

export default class ZWay {
  INCLUSION_KEY = 'controller.data.lastIncludedDevice'

  constructor(user) {
    this.user = user
    this.c = 0

    api.fetchDevises().then(resp => {
      this.Device = new DeviceService(resp.data.devices, this.user)

      setInterval(() => {
        this.checkDevices()
      }, 2000)

      setInterval(() => {
        this.c = this.c + 1
      }, 1000)
    })
  }

  checkNetworkData = async () => {
    const resp = await api.checkNetworkData()

    if (resp[this.INCLUSION_KEY]) {
      this.setDeviceName(resp[this.INCLUSION_KEY])
    }
  }

  checkDevices = async () => {
    const resp = await api.checkDevices()
    const testValue = (1.0 + Math.sin(this.c / 360 * 3)) / 2.0
    // Math.floor(Math.random() * 100) + 1
    this.Device.updateDevices(resp.data.devices, testValue)
  }

  setDeviceName = async ({ value }) => {
    const command = `devices[${value}].data.givenName.value='Device_${value}'`
    api.runDataCommand(command)
  }

  // fetchDevices = async () => {
  //   const resp = await api.fetchDevises()
  //   const hardDevices = Device.userDevices(resp.data.devices, this.user);
  //
  // }
}
