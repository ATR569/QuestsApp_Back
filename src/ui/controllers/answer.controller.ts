import { ClassMiddleware, Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Answer } from '@src/application/domain/model/answer'
import { answerService } from '@src/application/services/answer.service'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { authenticate } from '../middlewares/auth.middleware'

@Controller('answers')
@ClassMiddleware(authenticate)
export class AnswerController {

    /**
     * Creates a new answer to the question
     * @param req 
     * @param res 
     * @returns 
     */
    @Post('')
    public async createAnswer(req: Request, res: Response): Promise<Response> {
        try {
            const answer = new Answer().fromJSON(req.body).asNewEntity()
            const user_context = req.headers.user_context as string

            const result = await answerService.add(answer, user_context)

            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Get a answer by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Answer}
     */
    @Get(':answerId')
    public async getAnswerById(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string

            const result = await answerService.getById(req.params.answerId, user_context)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Update a answer by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {answer}
     */
    @Patch(':answerId/like')
    public async updateLikeById(req: Request, res: Response): Promise<Response> {
        try {
            const answer = new Answer().fromJSON(req.body)
            answer.id = req.params.answerId
            const user_context = req.headers.user_context as string

            const result = await answerService.updateLike(answer, user_context)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Update a answer by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {answer}
     */
    @Patch(':answerId')
    public async updateAnswerById(req: Request, res: Response): Promise<Response> {
        try {
            const answer = new Answer().fromJSON(req.body)
            answer.id = req.params.answerId
            const user_context = req.headers.user_context as string

            const result = await answerService.update(answer, user_context)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Remove a answer by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    @Delete(':answerId')
    public async removeAnswer(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string
            const result = await answerService.remove(req.params.answerId, user_context)
            return res.status(HttpStatus.NO_CONTENT).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }
}
