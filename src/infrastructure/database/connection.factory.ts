import mongoose, { Connection, Mongoose } from 'mongoose'


export interface IDBOptions {
}

export interface IConnectionFactory {
    createConnection(uri: string, options?: IDBOptions): Promise<any>
}

export class ConnectionFactoryMongoDB implements IConnectionFactory {
    private readonly options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    }

    /**
     * Create instance of MongoDB.
     *
     * @param uri This specification defines an URI scheme.
     * @return Promise<Connection>
     */
    public createConnection(uri: string): Promise<Connection> {

        return new Promise<Connection>((resolve, reject) => {
            mongoose.connect(uri, this.options)
                .then((result: Mongoose) => resolve(result.connection))
                .catch(err => reject(err))
        })
        
    }
}