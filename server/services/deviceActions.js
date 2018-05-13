import ZWayAPI from '../zway/api'

const api = new ZWayAPI()

export default class DeviceActions {
  typeCommands = {
    // 'switchMultilevel',
    // 'switchBinary',
    // 'switchRGBW',
    // 'doorlock',
    // 'doorLockControl',
    // 'toggleButton',
    // 'sensorMultilevel',
    // 'sensorBinary',
    // 'sensorDiscrete',
    // 'thermostat',
    // 'camera',
    // 'text',
    // 'switchControl',
    // 'sensorMultiline',
    // 'audioPlayer',
    // 'poppKeypad'
  }

  // constructor() {
  //
  // }

  setDeviceValue(device, variant) {
    switch (device.deviceType) {
      case 'switchBinary':
        this.switchDevice(device.id, variant.value)
        break
    }
  }

  updateDevice = id => {
    api.runDataCommand(id, 'update').then(resp => {
      console.log(resp)
    })
  }

  switchDevice = (id, state) => api.runDeviceCommand(id, state === true ? 'on' : 'off')
}
