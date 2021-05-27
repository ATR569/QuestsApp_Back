import { ClassMiddleware, Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import { groupsService } from '@src/application/services/groups.service'
import { Group } from '@src/application/domain/model/group'
import { authenticate } from '../middlewares/auth.middleware'

@Controller('groups')
@ClassMiddleware(authenticate)
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
            if (group.administrator !== undefined) group.members = [group.administrator]

            const user_context = req.headers.user_context as string

            const result = await groupsService.add(group, user_context)
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
            const { user_context } = req.headers
            const filters = { ...req.query, members: user_context }

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
            const user_context = req.headers.user_context as string

            const result = await groupsService.getById(req.params.group_id, user_context)

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
    @Delete(':group_id')
    public async removeGroup(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string

            await groupsService.remove(req.params.group_id, user_context)
            return res.status(HttpStatus.NO_CONTENT).send()
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
    @Patch(':group_id')
    public async updateGroupById(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string

            const group = new Group().fromJSON(req.body)
            group.id = req.params.group_id

            const result = await groupsService.update(group, user_context)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }
    /**
     * Remove a user from a group
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Group}
     */
    @Delete(':group_id/members/:member_id')
    public async removeMember(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string

            await groupsService.removeUserFromGroup(req.params.group_id, req.params.member_id, user_context)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }
}
