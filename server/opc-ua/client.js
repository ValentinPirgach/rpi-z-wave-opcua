import opcua from 'node-opcua'
import { debounce } from 'lodash'
import treeify from 'treeify'
import socketio from 'socket.io'
import MonitorItems from '../services/monitorItems'
import Device from '../models/Device'
// export default client

export default class OPCUAClient {
  static instance

  constructor(endpoint, server) {
    if (OPCUAClient.instance) {
      return OPCUAClient.instance
    }

    this.client = new opcua.OPCUAClient({})
    this.server = server
    this.endpoint = endpoint
    this.userIdentity = null
    this.session = null
    this.subscription = null
    this.io = socketio(server)
    this.init()

    OPCUAClient.instance = this

    return this
  }

  async init() {
    return Promise.all([
      await this.connect(),
      await this.createSession(),
      await this.browse(),
      await this.createSubscription(),
      await this.readWriteObjects(),
    ])
  }

  connect() {
    return new Promise(resolve => {
      this.client.connect(this.endpoint, () => {
        console.log('Connected'.yellow)
        resolve()
      })
    })
  }

  createSession() {
    return new Promise((resolve, reject) => {
      this.client.createSession(this.userIdentity, (err, session) => {
        if (!err) {
          this.session = session

          console.log('Session created'.yellow)
          resolve(session)
        } else {
          reject(err)
        }
      })
    })
  }

  async browse() {
    const rootBrowse = await this.session.browse('RootFolder')
    this.crawler = new opcua.NodeCrawler(this.session)

    return rootBrowse
  }

  createSubscription() {
    return new Promise(resolve => {
      this.subscription = new opcua.ClientSubscription(this.session, {
        requestedPublishingInterval: 2000,
        requestedMaxKeepAliveCount: 2000,
        requestedLifetimeCount: 6000,
        maxNotificationsPerPublish: 1000,
        publishingEnabled: true,
        priority: 10,
      })

      this.subscription
        .on('started', () => {
          console.log('Subscription started')
          resolve()
        })
        .on('keepalive', () => {
          console.log('keepalive')
        })
        .on('terminated', () => {
          console.log(' TERMINATED ------------------------------>')
        })
    })
  }

  async readWriteObjects() {
    // new MonitorItems(this.subscription)
    const nodeId = 'ns=1;i=100'

    console.log('now crawling object folder ...please wait...')

    this.crawler.on('browsed', element => {
      // console.log("->", element.browseName.name, element.nodeId.toString());
    })

    // setTimeout(() => {
    //   this.crawler.read(nodeId, async (err, obj) => {
    //     if (!err) {
    //       const devices = obj.organizes.map(d => ({
    //         browseName: d.browseName,
    //         nodeId: d.nodeId,
    //         componentsCount: d.hasComponent ? d.hasComponent.length : 0,
    //       }))
    //
    //       console.log('>>>>>>', devices)
    //
    //       await Device.remove({})
    //
    //       devices.forEach(async device => {
    //         await Device.findOneAndUpdate({ nodeId: device.nodeId, browseName: device.browseName }, device, {
    //           upsert: true,
    //         })
    //       })
    //     }
    //   })
    // }, 1000)
  }
}
