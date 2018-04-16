import opcua from 'node-opcua'
import OPCUAClient from '../opc-ua/client'

export default class MonitorItems {
  constructor() {
    this.subscription = new OPCUAClient().subscription
  }

  watch(nodeId) {
    return this.subscription.monitor(
      {
        nodeId,
        attributeId: 13,
      },
      {
        samplingInterval: 100,
        discardOldest: true,
        queueSize: 100,
      },
      opcua.read_service.TimestampsToReturn.Both,
      err => {
        if (err) {
          console.log(`Monitor ${nodeId.toString()} failed`)
          console.loo('ERr = ', err.message)
        }
      }
    )
  }
}
