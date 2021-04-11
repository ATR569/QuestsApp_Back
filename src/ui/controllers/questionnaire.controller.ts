import { Controller, Delete, Get, Post, Put } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'

@Controller('questionnaires')
export class QuestionnaireController {

    /**
     * Creates a new questionnaire
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Questionnaire}
     */
    @Post('')
    public async saveQuestionnaire(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.CREATED).send('Save Questionnaire')
    }

    /**
     * Get all questionnaires
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Array<Questionnaires>}
     */
    @Get('')
    public async getAllQuestionnaires(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Get all questionnaires')
    }

    /**
     * Get a questionnaire by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Questionnaire}
     */
    @Get(':id')
    public async getQuestionnaireById(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Get questionnaire by id')
    }

    /**
     * Remove a questionnaire by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    @Delete(':id')
    public async removeQuestionnaire(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.NO_CONTENT).send()
    }

    /**
     * Creates a new question
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Question}
     */
    @Post(':id/questions')
    public async saveQuestion(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.CREATED).send('Save Question')
    }

    /**
     * Get all questions of the questionnaire
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Array<Question>}
     */
    @Get(':id/questions')
    public async getAllQuestions(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Get questions by questionnaire_id')
    }
}