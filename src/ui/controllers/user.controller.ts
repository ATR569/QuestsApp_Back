import { Controller, Get, Patch, Post, Put } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import { User } from '@src/application/domain/model/User'
import { userService } from '@src/application/services/user.service'

@Controller('users')
export class UsersController {

    /**
     * 
     * Create new User
     * 
     * @param {Request} req 
     * @param {Response} res
     * @returns {User}
     */
    @Post('')
    public async saveUser(req: Request, res: Response) {
        try {
            const user = new User().fromJSON(req.body).asNewEntity()

            const result = await userService.add(user)

            return res.status(HttpStatus.CREATED).send(result)
        } catch (error) {
            const apiException = ApiExceptionManager.build(error)

            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * 
     * Get User by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {User}
     */
    @Get(':user_id')
    public async getUserById(req: Request, res: Response) {
        try {
            const result = await userService.getById(req.params.user_id)

            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)

            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * 
     * Get all user questionnaires
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Collection<Questionnaires>}
     */
    @Get(':id/questionnaires')
    public async getAllQuestionnaires(req: Request, res: Response) {
        try {
            const result = await userService.getAllQuestionnaires(req.params.user_id)
            
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)

            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * 
     * Get all user groups
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Collection<Group>}
     */
    @Get(':id/groups')
    public async getAllGroups(req: Request, res: Response) {
        try {
            const result = await userService.getAllGroups(req.params.user_id)

            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)

            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * 
     * Update user
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {User}
     */
    @Patch(':user_id')
    public async updateUser(req: Request, res: Response) {
        try {
            const user = new User().fromJSON(req.body)
            user.id = req.params.user_id

            const result = await userService.update(user)

            return res.status(HttpStatus.OK).send(result)
        } catch (error) {
            const apiException = ApiExceptionManager.build(error)

            return res.status(apiException.code).send(apiException)
        }
    }

    /**
     * 
     * Reset password
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {}
     */
    @Patch(':id/password')
    public async updatePassword(req: Request, res: Response) {
        try {
            const new_password = req.body
            
            const result = await userService.updatePassword(new_password)

            return res.status(HttpStatus.OK).send(result)
        } catch (error) {
            const apiException = ApiExceptionManager.build(error)

            return res.status(apiException.code).send(apiException)
        }
    }
}