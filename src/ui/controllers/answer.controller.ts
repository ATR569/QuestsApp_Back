import { Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import { answerService } from '@src/application/services/answer.service'
import { Answer } from '@src/application/domain/model/answer'


@Controller('answers')
export class AnswerController {



    /**
     * Get a answer by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Answer}
     */
    @Get(':answer_id')
    public async getAnswerById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await answerService.getById(req.params.answer_id)
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
    @Patch(':answer_id/like')
    public async updateAnswerById(req: Request, res: Response): Promise<Response> {
        try {
            const answer = new Answer().fromJSON(req.body)
            answer.id = req.params.answer_id
            const result = await answerService.update(answer)
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
    @Delete(':answer_id')
    public async removeAnswer(req: Request, res: Response): Promise<Response> {
        try {
            const result = await answerService.remove(req.params.answer_id)
            return res.status(HttpStatus.NO_CONTENT).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    
}