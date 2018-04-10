import { groupBy } from 'lodash'
import opcua from 'node-opcua'
import server from '../opc-ua'
import DeviceActions from './deviceActions'

export default class DeviceService {
  constructor(devices, user) {
    this.allDevices = devices
    this.devices = this.userDevices(devices, user)
    this.DeviceActions = new DeviceActions()

    if (process.env.NODE_ENV === 'development') {
      this.devices.staging = [
        {
          id: 'test_id_for_staging_device',
          metrics: {
            title: 'Test Device 1',
            level: false,
          },
        },
      ]
    }

    this.user = user

    this.registerOPC()
  }

  getDataType = type => {
    const DATA_TYPES = {
      string: 'String',
      number: 'Double',
      boolean: 'Boolean',
    }

    return DATA_TYPES[type] || 'Double'
  }

  userDevices = devices => groupBy(devices, 'deviceType')

  extractValue = metrics => {
    if (metrics.isFailed === true) {
      return opcua.StatusCodes.BadDataUnavailable
    }

    return new opcua.Variant({
      dataType: opcua.DataType[this.getDataType(typeof metrics.level)],
      value: metrics.level,
    })
  }

  updateDevices = (updatedDevices, devValue) => {
    Object.keys(this.devices).forEach(group => {
      if (group === 'staging' && devValue) {
        this.devices[group][0].metrics.level = devValue % 2 === 0
      }
    })

    updatedDevices.forEach(ud => {
      Object.keys(this.devices).forEach(group => {
        this.devices[group].forEach((device, i) => {
          if (ud.id === device.id) {
            this.devices[group][i].metrics = ud.metrics
          }
        })
      })
    })
  }

  addVariable = (node, device) => {
    if (device.metrics.level !== undefined) {
      server.engine.addressSpace.addVariable({
        componentOf: node,
        browseName: device.metrics.probeTitle || device.metrics.title,
        dataType: this.getDataType(typeof device.metrics.level),
        description: JSON.stringify({ scaleTitle: device.metrics.scaleTitle }),
        accessLevel: 3,
        value: {
          get: () => this.extractValue(device.metrics),
          set: variant => {
            this.DeviceActions.setDeviceValue(device, variant)

            return opcua.StatusCodes.Good
          },
        },
      })
    }
  }

  registerOPC = () => {
    const devicesNode = server.engine.addressSpace.addFolder('ObjectsFolder', { browseName: 'Devices' })

    Object.keys(this.devices).forEach(group => {
      const groupNode = server.engine.addressSpace.addFolder(devicesNode, { browseName: group })

      this.devices[group].forEach(device => {
        this.addVariable(groupNode, device)
      })
    })
  }
}
