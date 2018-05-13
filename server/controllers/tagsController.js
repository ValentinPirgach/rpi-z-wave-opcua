import OPCUAClient from '../opc-ua/client'
// import MonitorItems from '../services/monitorItems'
// import Tag from '../models/Tag'

export default class TagsController {
  show(req, res) {
    // const monitor = new MonitorItems()
    const client = new OPCUAClient()
    const nodeId = req.params.nodeId
    // const item = monitor.watch(nodeId)

    // item.on('changed', () => {
    //
    // });

    client.session.readAllAttributes(nodeId, (err, data) => {
      if (err) {
        return res.status(404).error(err)
      }

      return res.json(data)
    })
  }
}
