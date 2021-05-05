import { Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Answer } from '@src/application/domain/model/answer'
import { answerService } from '@src/application/services/answer.service'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { ApiExceptionManager } from '../exception/api.exception.manager'


@Controller('answers')
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
   
                 const result = await answerService.add(answer)
     
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
    @Get(':answerID')
    public async getAnswerById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await answerService.getById(req.params.answerID)
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
    @Patch(':answerID/like')
    public async updateLikeById(req: Request, res: Response): Promise<Response> {
        try {
            const answer = new Answer().fromJSON(req.body)
            const result = await answerService.updateLike(answer)
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
     @Patch(':answerID')
     public async updateAnswerById(req: Request, res: Response): Promise<Response> {
         try {
             const answer = new Answer().fromJSON(req.body)

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
    @Delete(':answerID')
    public async removeAnswer(req: Request, res: Response): Promise<Response> {
        try {
            const result = await answerService.remove(req.params.answerID)
            return res.status(HttpStatus.NO_CONTENT).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    
}