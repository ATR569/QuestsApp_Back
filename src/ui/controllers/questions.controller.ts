import { Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import { questionService } from '@src/application/services/question.service'
import { Question } from '@src/application/domain/model/question'
import { Answer } from '@src/application/domain/model/answer'


@Controller('questions')
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

            const result = await questionService.add(question)
            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Creates a new answer to the question
     * @param req 
     * @param res 
     * @returns 
     */
    @Post(':question_id/answer')
    public async saveAnswer(req: Request, res: Response): Promise<Response> {
        try {
            const question_id = req.params.question_id
            const createdAnswer = new Answer().fromJSON(req.body).asNewEntity()
            createdAnswer.question_id = question_id

            const result = await questionService.createAnswer(createdAnswer)

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
    @Get(':question_id/answer')
    public async getAnswerByQuestionId(req: Request, res: Response): Promise<Response> {
        try {
            const filters = { ...req.query }
            const result = await questionService.getAllAnswers(req.params.question_id)
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
    @Patch(':question_id')
    public async updateQuestionById(req: Request, res: Response): Promise<Response> {
        try {
            const question = new Question().fromJSON(req.body)
            question.id = req.params.question_id
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

    /** Vai para answer
     * Delete the answer by idquestion
     * @param req 
     * @param res 
     * @returns 
     */
         @Delete(':question_id/answer/answer_id')
         public async removeAnswerById(req: Request, res: Response): Promise<Response> {
             try {
                 const result = await questionService.remove(req.params.question_id)
                 return res.status(HttpStatus.NO_CONTENT).send(result)
             } catch (err) {
                 const apiException = ApiExceptionManager.build(err)
                 return res.status(apiException.code).send(apiException)
             }
         }


}