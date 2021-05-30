import { Controller, Get, Middleware, Patch, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import { User } from '@src/application/domain/model/user'
import { userService } from '@src/application/services/user.service'
import { authenticate } from '../middlewares/auth.middleware'

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
    @Middleware(authenticate)
    public async getUserById(req: Request, res: Response) {
        const user_context = req.headers.user_context as string

        return await userService.getById(req.params.user_id, user_context)
            .then(result => {
                return res.status(HttpStatus.OK).send(result)
            })
            .catch(err => {
                const apiException = ApiExceptionManager.build(err)
                return res.status(apiException.code).send(apiException)
            })

    }

    /**
     * 
     * Get all user questionnaires
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Collection<Questionnaires>}
     */
    @Get(':user_id/questionnaires')
    @Middleware(authenticate)
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
    @Get(':user_id/groups')
    @Middleware(authenticate)
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
    @Middleware(authenticate)
    public async updateUser(req: Request, res: Response) {
        try {
            const user = new User().fromJSON(req.body).asNewEntity()
            user.id = req.params.user_id

            const user_context = req.headers.user_context as string

            const result = await userService.update(user, user_context)

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
    @Patch(':user_id/password')
    @Middleware(authenticate)
    public async updatePassword(req: Request, res: Response) {
        try {
            const new_password = req.body.new_password
            const old_password = req.body.old_password
            const user_id = req.params.user_id
            const user_context = req.headers.user_context as string
            
            const result = await userService.updatePassword(user_id, old_password, new_password, user_context)

            return res.status(HttpStatus.OK).send(result)
        } catch (error) {
            const apiException = ApiExceptionManager.build(error)

            return res.status(apiException.code).send(apiException)
        }
    }
}
