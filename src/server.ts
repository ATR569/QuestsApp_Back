import './utils/module-alias'
import { Server } from '@overnightjs/core'
import bodyParser from 'body-parser'
import { Application } from 'express'
import { notFoundHandler } from './ui/exception/exception.handler'
import * as http from 'http'

import { GroupsController } from '@src/ui/controllers/groups.controller'
import { UsersController } from '@src/ui/controllers/user.controller'
import { QuestionnaireController } from '@src/ui/controllers/questionnaire.controller'
import { QuestionsController } from './ui/controllers/questions.controller'
import { MongoDB } from './infrastructure/database/mongo.db'


export class SetupServer extends Server {
    private readonly database = new MongoDB()
    private server?: http.Server

    constructor(
        private port: any = 3000, 
        private mongoUri: string = 'mongodb://localhost:27017/questsapp'
    ){
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
        const usersController = new UsersController()
        const questionsController = new QuestionsController()
        
        // Add all controllers here
        const controllers: Array<object> = [
            groupsController,
            questionnaireController,
            usersController,
            questionsController
        ]

        this.addControllers(controllers)
    }

    private async setupDatabase(): Promise<void> {
        await this.database.connect(this.mongoUri)
    }

    public getApp(): Application {
        return this.app
    }

}
