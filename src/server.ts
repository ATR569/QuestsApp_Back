import './utils/module-alias'
import { Server } from '@overnightjs/core'
import bodyParser from 'body-parser'
import { Application } from 'express'
import { notFoundHandler } from './ui/exception/exception.handler'
import * as http from 'http'

import { GroupsController } from '@src/ui/controllers/groups.controller'
import { QuestionnaireController } from '@src/ui/controllers/questionnaire.controller'
import { MongoDB } from './infrastructure/database/mongo.db'

export class SetupServer extends Server {
    
    private server?: http.Server

    constructor(private port = 3000, private readonly database = new MongoDB()) {
        super()
    }

    public init(): void {
        this.setupExpress()
        this.setupControllers()
        this.setupErrorsHandler()
        this.setupDatabase()
    }

    public start(): void {
        this.server = this.app.listen(this.port, () => {
            console.log('Server listening on port: ' + this.port)
        })
    }

    private setupErrorsHandler(): void {
        // Handle 404
        this.app.use(notFoundHandler)
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json())
    }

    private setupControllers(): void {
        const groupsController = new GroupsController()
        const questionnaireController = new QuestionnaireController()
        
        // Add all controllers here
        const controllers: Array<object> = [
            groupsController,
            questionnaireController
        ]

        this.addControllers(controllers)
    }

    private async setupDatabase(): Promise<void> {
        await this.database.connect('mongodb://localhost:27017/questsapp')
    }

    public getApp(): Application {
        return this.app
    }

}
