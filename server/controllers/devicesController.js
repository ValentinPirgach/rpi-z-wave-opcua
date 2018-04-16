import Device from '../models/Device'
import OPCUAClient from '../opc-ua/client'

export default class DevicesController {
  async index(req, res) {
    try {
      const devices = await Device.find({})
      const plain = devices.map(d => d.toObject())

      res.json(plain)
    } catch (error) {
      res.status(404).json(error)
    }
  }

  show(req, res) {
    const client = new OPCUAClient()

    if (!req.params.nodeId) return res.status(400)

    return client.crawler.read(req.params.nodeId, async (err, obj) => {
      if (err) {
        return res.status(500).error(err)
      }

      return res.json(obj)
    })
  }
}
