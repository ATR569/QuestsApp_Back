import { Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import { groupsService} from '@src/application/services/groups.service'
import { Group } from '@src/application/domain/model/group'
import { GroupValidator } from '@src/application/domain/validation/group.validator'

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
        try {
            const group = new Group().fromJSON(req.body).asNewEntity()
            
            GroupValidator.validateCreate(group)

            const result = await groupsService.add(group)
            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
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
        try {
            const filters = {...req.query}
            const result = await groupsService.getAll(filters)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Get a study group by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Group}
     */
    @Get(':group_id')
    public async getGroupById(req: Request, res: Response): Promise<Response> {
        try {
            const result = await groupsService.getById(req.params.group_id)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
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
        try {
            const result = await groupsService.getAllQuestionnaires(req.params.group_id)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Remove a study group by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Group}
     */
    @Delete(':id')
    public async removeGroup(req: Request, res: Response): Promise<Response> {
        try {
            const result = await groupsService.remove(req.params.group_id)
            return res.status(HttpStatus.NO_CONTENT).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * Update a study group by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Group}
     */
    @Patch(':id')
    public async updateGroupById(req: Request, res: Response): Promise<Response> {
        try {
            const group = new Group().fromJSON(req.body)
            GroupValidator.validateUpdate(group)
            
            const result = await groupsService.update(group)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

}