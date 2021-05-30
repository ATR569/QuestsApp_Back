import { ClassMiddleware, Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import { AnswerComment } from '@src/application/domain/model/answer.comment'
import { answerCommentService } from '@src/application/services/answerComment.service'
import { authenticate } from '../middlewares/auth.middleware'

@Controller('answercomment')
@ClassMiddleware(authenticate)
export class AnswerCommentController {

    /**
     * Creates a new answer comment
     * 
     * @param req 
     * @param res 
     * @returns {AnswerComment}
     */
    @Post('')
    public async saveAnswerComment(req: Request, res: Response): Promise<Response> {
        try {
            const answerComment = new AnswerComment().fromJSON(req.body).asNewEntity()
            const user_context = req.headers.user_context as string

            const result = await answerCommentService.add(answerComment, user_context)
            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Get all comments
     * 
     * @param req 
     * @param res 
     * @returns {Array<AnswerComment>}
     */
    @Get('')
    public async getAllComments(req: Request, res: Response): Promise<Response> {
        try {
            const filters = { ...req.query }
            const result = await answerCommentService.getAll(filters)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Update a comment by id
     * 
     * @param req 
     * @param res 
     * @returns {AnswerComment}
     */
    @Patch(':answercomment_id')
    public async updateCommentById(req: Request, res: Response): Promise<Response> {
        try {
            const answerComment = new AnswerComment().fromJSON(req.body)
            answerComment.id = req.params.answercomment_id
            const user_context = req.headers.user_context as string

            const result = await answerCommentService.update(answerComment, user_context)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Remove a comment by id
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Delete(':answercomment_id')
    public async removeComment(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string
            
            const result = await answerCommentService.remove(req.params.answercomment_id, user_context)
            return res.status(HttpStatus.NO_CONTENT).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }
}