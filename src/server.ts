import './utils/module-alias'
import { Server } from '@overnightjs/core'
import bodyParser from 'body-parser'
import { Application } from 'express'
import { notFoundHandler } from './ui/exception/exception.handler'
import * as http from 'http'

import { AuthController } from '@src/ui/controllers/auth.controller'
import { GroupsController } from '@src/ui/controllers/groups.controller'
import { UsersController } from '@src/ui/controllers/user.controller'
import { QuestionnaireController } from '@src/ui/controllers/questionnaire.controller'
import { QuestionsController } from './ui/controllers/questions.controller'
import { AnswerController } from './ui/controllers/answer.controller'
import { AnswerCommentController } from './ui/controllers/answerComment.controller'
import { MongoDB } from './infrastructure/database/mongo.db'
import cors from 'cors'
import { InvitesController } from './ui/controllers/invites.controller'
require('dotenv').config()

const port_http = process.env.PORT_HTTP || 3000
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/questsapp'

export class SetupServer extends Server {
    private readonly database = new MongoDB()
    private server?: http.Server
    private mongoUri: string
    private port: any
    private isRunning: boolean

    constructor() {
        super()
        this.mongoUri = mongoUri
        this.port = port_http
        this.isRunning = false
    }

    public init(): void {
        if (!this.isRunning) {
            this.setupExpress()
            this.setupControllers()
            this.setupErrorsHandler()
            this.setupDatabase()
        }
    }

    public start(): void {
        if (!this.isRunning) {
            this.server = this.app.listen(this.port, () => {
                this.isRunning = true
                console.log('Server listening on port: ' + this.port)
            })
        }
    }

    private setupErrorsHandler(): void {
        // Handle 404
        this.app.use(notFoundHandler)
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json())
        this.app.use(cors({ origin: '*' }))
    }

    private setupControllers(): void {
        const authController = new AuthController()
        const groupsController = new GroupsController()
        const questionnaireController = new QuestionnaireController()
        const usersController = new UsersController()
        const questionsController = new QuestionsController()
        const invitesController = new InvitesController()
        const answersController = new AnswerController()
        const answersCommentController = new AnswerCommentController()

        // Add all controllers here
        const controllers: Array<object> = [
            authController,
            groupsController,
            questionnaireController,
            usersController,
            questionsController,
            invitesController,
            answersController,
            answersCommentController
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
