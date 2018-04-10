import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import 'colors'
import { mongoConnection } from './config/mongo'
import OPCUAServer from './opc-ua'
import './config/axios'
import './zway'

const MongoStore = connectMongo(session)
const app = express()

app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true,
    secret: '_rpi-opc',
  })
)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const listen = () => {
  const WEB_APP_PORT = process.env.WEB_APP_PORT || 3000

  app.listen(WEB_APP_PORT, () => {
    console.log('\n\n================================================='.green)
    console.log('RPI Z-Wave web server listening on port 3000...'.green)

    OPCUAServer.start(() => {
      console.log('OPC Server is now listening...'.green)
      console.log(`OPC Server Port: ${OPCUAServer.endpoints[0].port}`.green)
      const endpointUrl = OPCUAServer.endpoints[0].endpointDescriptions()[0].endpointUrl
      console.log(`The primary server endpoint url is: ${endpointUrl}`.green)
      console.log('================================================='.green)
    })
  })
}

const connect = async () => {
  await mongoose.connect(mongoConnection.uri)
  listen()
}

connect()
