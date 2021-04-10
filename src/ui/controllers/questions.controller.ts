import { Controller, Delete, Get, Post, Put } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'

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
        return res.status(HttpStatus.CREATED).send('Resposta salva')
    }
    
    /**
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Get(':question_id')
    public async getQuestionsById(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Questão por id')
    }

    /**
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Get(':question_id/answer')
    public async getAnswerQuestionById(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Respostas da questão por id')
    }

    /**
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    @Delete(':question_id')
    public async deleteQuestionById(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Questão deletada')
    }


}