import { ClassMiddleware, Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Question } from '@src/application/domain/model/question'
import { questionService } from '@src/application/services/question.service'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { authenticate } from '../middlewares/auth.middleware'

@Controller('questions')
@ClassMiddleware(authenticate)
export class QuestionsController {

    /**
    * Creates a new question
    * @param req 
    * @param res 
    * @returns 
    */
    @Post('')
    public async saveQuestion(req: Request, res: Response): Promise<Response> {
        try {
            const question = new Question().fromJSON(req.body).asNewEntity()
            const user_context = req.headers.user_context as string

            const result = await questionService.add(question, user_context)

            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Get question by id
     * @param req 
     * @param res 
     * @returns 
     */
    @Get(':questionId')
    public async getQuestionById(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string

            const result = await questionService.getById(req.params.questionId, user_context)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Get all questions
     * @param req 
     * @param res 
     * @returns 
     */
    @Get('')
    public async getAllQuestions(req: Request, res: Response): Promise<Response> {
        try {
            const filters = { ...req.query }
            const user_context = req.headers.user_context as string

            const result = await questionService.getAll(filters, user_context)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Get answer by question id
     * @param req 
     * @param res 
     * @returns 
     */
    @Get(':questionId/answer')
    public async getAnswerByquestionId(req: Request, res: Response): Promise<Response> {
        try {
            const filters = { ...req.query }
            const result = await questionService.getAllAnswers(req.params.questionId)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Update a question by id
     * @param req 
     * @param res 
     * @returns 
     */
    @Patch(':questionId')
    public async updateQuestionById(req: Request, res: Response): Promise<Response> {
        try {
            const filters = { ...req.query }
            const question = new Question().fromJSON(req.body)
            question.id = req.params.questionId
            const user_context = req.headers.user_context as string

            const result = await questionService.update(question, user_context)

            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Delete the question
     * @param req 
     * @param res 
     * @returns 
     */
    @Delete(':questionId')
    public async removeQuestionById(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string

            const result = await questionService.remove(req.params.questionId, user_context)
            return res.status(HttpStatus.NO_CONTENT).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }
}
