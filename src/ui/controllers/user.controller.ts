import { Controller, Get, Patch, Post, Put } from '@overnightjs/core'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import HttpStatus from 'http-status-codes'
import { UsersService } from '@src/application/services/user.service'

@Controller('users')
export class UsersController {

    private userService = new UsersService()

    /**
     * 
     * @param {Request} req 
     * @param {Response} res
     * @returns {User}
     */
    @Post('')
    public async saveUser(req: Request, res: Response) {
        let user = new String('User') // instanciar um Usuario

        this.userService.add('user')

        return res.status(HttpStatus.CREATED).send('Save User')
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {User}
     */
    @Get(':id')
    public async getUserById(req: Request, res: Response) {
        return res.status(HttpStatus.OK).send('User')
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Collection<Questionnaires>}
     */
    @Get(':id/questionnaires')
    public async getAllQuestionnaires(req: Request, res: Response) {
        return res.status(HttpStatus.OK).send('All user Questionnaries')
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Collection<Group>}
     */
    @Get(':id/groups')
    public async getAllGroups(req: Request, res: Response) {
        return res.status(HttpStatus.OK).send('All user Groups')
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {User}
     */
    @Put(':id')
    public async updateUser(req: Request, res: Response) {
        return res.status(HttpStatus.OK).send('Updated user')
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {}
     */
    @Patch(':id/password')
    public async updatePassword(req: Request, res: Response) {
        return res.status(HttpStatus.OK).send('Updated user password')
    }
}