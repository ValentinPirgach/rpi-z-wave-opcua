import opcua from 'node-opcua'

export default class OPCUAServer {
  static instance

  constructor() {
    if (OPCUAServer.instance) {
      return OPCUAServer.instance
    }

    this.server = new opcua.OPCUAServer({
      port: process.env.OPCUA_PORT, // the port of the listening socket of the server
      resourcePath: 'UA/RpiZWaveServer', // this path will be added to the endpoint resource name
      buildInfo: {
        productName: 'RPI_OPC_UA_SERVER',
        buildNumber: '0001',
        buildDate: new Date(),
      },
    })

    OPCUAServer.instance = this

    return this
  }
}
