import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import path from 'path'
import http from 'http'
import bodyParser from 'body-parser'

import 'colors'
import { mongoConnection } from './config/mongo'
import OPCUAServer from './opc-ua/server'
import OPCUAClient from './opc-ua/client'
import routes from './routes'
import './config/axios'
import './zway'

/* eslint no-unused-vars: 0 */

const MongoStore = connectMongo(session)
const app = express()
const server = http.Server(app)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(bodyParser.json({ type: 'application/json' }))
app.use('/api', routes)
app.get('/', (req, res) => {
  const filePath = path.resolve(__dirname, '../public/index.html')
  res.sendFile(filePath)
})

const listen = () => {
  const WEB_APP_PORT = process.env.WEB_APP_PORT || 3000

  console.clear()

  const httpServer = server.listen(WEB_APP_PORT, () => {
    console.log('\n\n================================================='.green)
    console.log('RPI Z-Wave web server listening on port 3000...'.green)

    const opcServer = new OPCUAServer()

    opcServer.server.start(() => {
      console.log('OPC Server is now listening...'.green)
      console.log(`OPC Server Port: ${opcServer.server.endpoints[0].port}`.green)
      const endpointUrl = opcServer.server.endpoints[0].endpointDescriptions()[0].endpointUrl
      console.log(`The primary server endpoint url is: ${endpointUrl}`.green)
      console.log('================================================='.green)

      new OPCUAClient(endpointUrl, server)
    })
  })
}

const connect = async () => {
  await mongoose.connect(mongoConnection.uri)
  listen()
}

connect()
