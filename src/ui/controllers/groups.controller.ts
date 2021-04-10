import { Controller, Get, Post, Put } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'

@Controller('groups')
export class GroupsController {

    /**
     * Creates a new study group
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Group}
     */
    @Post('')
    public async saveGroup(req: Request, res: Response): Promise<Response> {
        // TO DO
        return res.status(HttpStatus.CREATED).send('Save Group')
    }
    
    /**
     * Get all study groups.
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Array<Group>}
     */
    @Get('')
    public async getAllGroups(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send(['Get all Groups'])
    }

    /**
     * Get a study group by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Group}
     */
    @Get(':id')
    public async getGroupById(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Get group by id')
    }

    /**
     * Get a study group by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Group}
     */
    @Get(':id/questionnaires')
    public async getAllQuestionnairesFromGroup(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Get all questionnaires from group')
    }

    /**
     * Remove a study group by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Group}
     */
    @Put(':id')
    public async removeGroup(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Remove group')
    }

    /**
     * Update a study group by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Group}
     */
    @Put(':id')
    public async updateGroupById(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send('Update group by id')
    }



}