import { SetupServer } from './src/server'

require('dotenv').config()

const port_http = process.env.PORT_HTTP
const mongoUri = process.env.MONGO_URI

const server = new SetupServer(port_http, mongoUri)
server.init()

server.start()
