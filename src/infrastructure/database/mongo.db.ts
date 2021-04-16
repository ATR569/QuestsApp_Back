import { Connection } from 'mongoose'
import { IConnectionFactory, IDBOptions, ConnectionFactoryMongoDB } from './connection.factory'
import { EventEmitter } from 'events'

export class MongoDB {
    private _connection?: Connection
    private readonly _eventConnection: EventEmitter

    constructor(
        private readonly _connectionFactory: IConnectionFactory = new ConnectionFactoryMongoDB(),
    ) {
        this._eventConnection = new EventEmitter()
    }

    get eventConnection(): EventEmitter {
        return this._eventConnection
    }

    public async connect(uri: string, options?: IDBOptions): Promise<void> {
        const _this = this

        await this._connectionFactory.createConnection(uri)
            .then((connection: Connection) => {
                this._connection = connection
                this.connectionStatusListener(this._connection)
                this._eventConnection.emit('connected')
            })
            .catch((err) => {
                this._connection = undefined
                this._eventConnection.emit('disconnected')
                setTimeout(async () => {
                    _this.connect(uri, options).then()
                }, 2000)
            })
    }

    /**
     * Initializes connected and disconnected listeners.
     *
     * @param connection
     */
    private connectionStatusListener(connection: Connection | undefined): void {
        if (!connection) {
            this._connection = undefined
            this._eventConnection.emit('disconnected')
            return
        }

        connection.on('connected', () => {
            this._eventConnection.emit('connected')
        })

        connection.on('disconnected', () => {
            this._connection = undefined
            this._eventConnection.emit('disconnected')
        })
    }

    /**
     * Releases the resources.
     *
     * @return {Promise<void>}
     */
    public async dispose(): Promise<void> {
        if (this._connection) {
            this._connection.removeAllListeners()
            await this._connection.close()
        }
        this._connection = undefined
    }
}
