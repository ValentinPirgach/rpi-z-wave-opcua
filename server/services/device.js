import { groupBy } from 'lodash'
import opcua from 'node-opcua'
import OPCUAServer from '../opc-ua/server'
import DeviceActions from './deviceActions'
import DeviceOPCInfo from './deviceOPCInfo'

export default class DeviceService {
  constructor(devices, user) {
    this.allDevices = devices
    this.devices = this.userDevices(devices, user)
    this.DeviceActions = new DeviceActions()
    this.OPCUAServer = new OPCUAServer()

    if (process.env.NODE_ENV === 'development') {
      this.devices.staging = [
        {
          id: 'test_id_for_staging_device',
          metrics: {
            title: 'Test Device 1',
            level: 1.0,
            scaleTitle: '%',
          },
        },
      ]
    }

    this.user = user

    this.registerOPC()
  }

  userDevices = devices => groupBy(devices, 'deviceType')

  extractValue = metrics => {
    if (metrics.isFailed === true) {
      return opcua.StatusCodes.BadDataUnavailable
    }

    return new opcua.Variant({
      dataType: DeviceOPCInfo.getDataType(metrics.level),
      value: metrics.level,
    })
  }

  updateDevices = (updatedDevices, devValue) => {
    Object.keys(this.devices).forEach(group => {
      if (group === 'staging' && devValue) {
        this.devices[group][0].metrics.level = devValue
      }
    })

    updatedDevices.forEach(ud => {
      Object.keys(this.devices).forEach(group => {
        this.devices[group].forEach((device, i) => {
          if (ud.id === device.id) {
            const { level } = DeviceOPCInfo.checkForSwitch(ud.metrics.level)
            this.devices[group][i].metrics = { ...ud.metrics, level }
          }
        })
      })
    })
  }

  addVariable = (node, device) => {
    if (device.metrics.level !== undefined) {
      const deviceInfo = new DeviceOPCInfo(device)

      const item = this.OPCUAServer.server.engine.addressSpace.addVariable({
        componentOf: node,
        browseName: device.metrics.probeTitle || device.metrics.title,
        dataType: deviceInfo.getDataTypeAsString(),
        description: JSON.stringify({ ZWaveDevice: device }),
        accessLevel: 3,
        value: {
          get: () => deviceInfo.getValue(),
          set: variant => {
            this.DeviceActions.setDeviceValue(device, variant)

            return opcua.StatusCodes.Good
          },
        },
      })

      this.OPCUAServer.server.engine.addressSpace.installHistoricalDataNode(item)
    }
  }

  addAnalogItem = (node, device) => {
    if (device.metrics.level !== undefined) {
      const deviceInfo = new DeviceOPCInfo(device)

      const item = this.OPCUAServer.server.engine.addressSpace.addAnalogDataItem({
        componentOf: node,
        browseName: device.metrics.probeTitle || device.metrics.title,
        dataType: deviceInfo.getDataTypeAsString(),
        engineeringUnits: deviceInfo.getEngineeringUnits().units,
        engineeringUnitsRange: deviceInfo.getEngineeringUnits().range,
        description: JSON.stringify({ ZWaveDevice: device }),
        accessLevel: 3,
        value: {
          get: () => this.extractValue(device.metrics),
          set: variant => {
            this.DeviceActions.setDeviceValue(device, variant)

            return opcua.StatusCodes.Good
          },
        },
      })

      this.OPCUAServer.server.engine.addressSpace.installHistoricalDataNode(item)
    }
  }

  registerOPC = () => {
    const nodeId = new opcua.NodeId(opcua.NodeIdType.NUMERIC, 100, 1)
    const devicesNode = this.OPCUAServer.server.engine.addressSpace.addFolder('ObjectsFolder', {
      browseName: 'Devices',
      nodeId,
    })

    Object.keys(this.devices).forEach(group => {
      const groupNode = this.OPCUAServer.server.engine.addressSpace.addObject({
        browseName: group,
        organizedBy: devicesNode,
      })

      this.devices[group].forEach(device => {
        if (device.metrics && device.metrics.level && typeof device.metrics.level === 'number') {
          this.addAnalogItem(groupNode, device)
        } else {
          this.addVariable(groupNode, device)
        }
      })
    })
  }
}
