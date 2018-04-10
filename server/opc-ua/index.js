import opcua from 'node-opcua'

// Let's create an instance of OPCUAServer
const server = new opcua.OPCUAServer({
  port: process.env.OPCUA_PORT, // the port of the listening socket of the server
  resourcePath: 'UA/RpiZWaveServer', // this path will be added to the endpoint resource name
  buildInfo: {
    productName: 'RPI_OPC_UA_SERVER',
    buildNumber: '0001',
    buildDate: new Date(),
  },
})

export default server
