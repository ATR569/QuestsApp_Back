import { Controller, Delete, Get, Post, Put } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import { questionnairesService } from '@src/application/services/questionnaire.service'
import { Questionnaire } from '@src/application/domain/model/Questionnaire'

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
        try {
            const questionnaire = new Questionnaire().fromJSON(req.body).asNewEntity()

            const result = await questionnairesService.add(questionnaire)
            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
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
        try {
            const filters = { ...req.query }
            const result = await questionnairesService.getAll(filters)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Get a questionnaire by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Questionnaire}
     */
    @Get(':questionnaire_id')
    public async getQuestionnaireById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await questionnairesService.getById(req.params.questionnaire_id)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Remove a questionnaire by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    @Delete(':questionnaire_id')
    public async removeQuestionnaire(req: Request, res: Response): Promise<Response> {
        try {
            const result = await questionnairesService.remove(req.params.questionnaire_id)
            return res.status(HttpStatus.NO_CONTENT).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
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
        //TODO
        return res.status(HttpStatus.CREATED).send('Save Question')
    }

    /**
     * Get all questions from questionnaire
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Array<Question>}
     */
    @Get(':id/questions')
    public async getAllQuestionsFromQuestionnaire(req: Request, res: Response): Promise<Response> {
        //TODO
        return res.status(HttpStatus.OK).send('Get questions by questionnaire_id')
    }
}