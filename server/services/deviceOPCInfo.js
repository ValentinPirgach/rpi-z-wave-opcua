import { standardUnits, DataType, Variant, StatusCodes } from 'node-opcua'

export default class DeviceOPCInfo {
  constructor(device) {
    this.device = device
  }

  static UNITS = {
    '°C': {
      units: standardUnits.degree_celsius,
      range: {
        low: 0,
        height: 50.0,
      },
    },
    '%': {
      units: standardUnits.percent,
      range: {
        low: 0,
        height: 100.0,
      },
    },
  }

  static DATA_TYPES = {
    string: 'String',
    number: 'Double',
    boolean: 'Boolean',
  }

  static checkForSwitch(level) {
    if (level === 'on' || level === 'off') {
      return {
        type: 'boolean',
        level: level === 'on',
      }
    }

    return {
      type: typeof level,
      level,
    }
  }

  static getDataType(value) {
    const checked = DeviceOPCInfo.checkForSwitch(value)
    return DataType[DeviceOPCInfo.DATA_TYPES[checked.type]] || DataType.Double
  }

  getDataTypeAsString() {
    if (this.device.metrics && this.device.metrics.level) {
      const checked = DeviceOPCInfo.checkForSwitch(this.device.metrics.level)
      console.log(this.device.metrics.title, checked)
      return DeviceOPCInfo.DATA_TYPES[checked.type]
    }

    return 'Double'
  }

  getEngineeringUnits() {
    if (this.device.metrics && this.device.metrics.scaleTitle) {
      return DeviceOPCInfo.UNITS[this.device.metrics.scaleTitle]
    }

    return {}
  }

  getValue() {
    if (this.device.metrics.isFailed === true) {
      return StatusCodes.BadDataUnavailable
    }

    const checked = DeviceOPCInfo.checkForSwitch(this.device.metrics.level)

    return new Variant({
      dataType: DeviceOPCInfo.getDataType(this.device.metrics.level),
      value: checked.level,
    })
  }
}
