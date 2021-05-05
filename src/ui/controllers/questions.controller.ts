import { Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Question } from '@src/application/domain/model/question'
import { questionService } from '@src/application/services/question.service'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { ApiExceptionManager } from '../exception/api.exception.manager'


@Controller('questions')
export class QuestionsController {

    /**
    * Creates a new question
    * @param req 
    * @param res 
    * @returns 
    */
    @Post('')
    public async createQuestion(req: Request, res: Response): Promise<Response> {
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
    @Get(':questionID')
    public async getQuestionsById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await questionService.getById(req.params.questionID)
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
            const result = await questionService.getAll(filters)
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
    @Get(':questionID/answer')
    public async getAnswerByQuestionId(req: Request, res: Response): Promise<Response> {
        try {
            const filters = { ...req.query }
            const result = await questionService.getAllAnswers(req.params.questionID)
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
    @Patch(':questionID')
    public async updateQuestionById(req: Request, res: Response): Promise<Response> {
        try {
            const question = new Question().fromJSON(req.body)
            question.id = req.params.questionID
            
            const result = await questionService.update(question)
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
    @Delete(':questionID')
    public async removeQuestionById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await questionService.remove(req.params.questionID)
            return res.status(HttpStatus.NO_CONTENT).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /** Vai para answer
     * Delete the answer by idquestion
     * @param req 
     * @param res 
     * @returns 
     */
         @Delete(':questionID/answer/answerID')
         public async removeAnswerById(req: Request, res: Response): Promise<Response> {
             try {
                 const result = await questionService.remove(req.params.questionID)
                 return res.status(HttpStatus.NO_CONTENT).send(result)
             } catch (err) {
                 const apiException = ApiExceptionManager.build(err)
                 return res.status(apiException.code).send(apiException)
             }
         }


}