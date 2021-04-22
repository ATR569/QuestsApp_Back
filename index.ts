import { SetupServer } from './src/server'

require('dotenv').config()

const port_http = process.env.PORT_HTTP || 3000
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/questsapp'

const server = new SetupServer(port_http, mongoUri)
server.init()

server.start()
