import { Controller, Delete, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import {questionService} from '@src/application/services/question.service'
import { Question } from '@src/application/domain/model/question'


@Controller('questions')
export class QuestionsController {

    /**
     * Creates a new answer to the question
     * @param req 
     * @param res 
     * @returns 
     */
    @Post(':question_id/answer')
    public async saveAnswer(req: Request, res: Response): Promise<Response> {
        try {
            const question = new Question().fromJSON(req.body).asNewEntity()

            const result = await questionService.add(question)
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
    @Get(':question_id')
    public async getQuestionsById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await questionService.getById(req.params.question_id)
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
    @Get(':question_id/answer')
    public async getAnswerByQuestionId(req: Request, res: Response): Promise<Response> {
        try {
            const result = await questionService.getAllAnswers(req.params.question_id)
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
    @Delete(':question_id')
    public async removeQuestionById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await questionService.remove(req.params.question_id)
            return res.status(HttpStatus.NO_CONTENT).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }


}