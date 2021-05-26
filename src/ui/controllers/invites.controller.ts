import HttpStatus from 'http-status-codes'
import { ClassMiddleware, Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Invite, InviteStatus } from '@src/application/domain/model/invite'
import { Request, Response } from 'express'
import { invitesService } from '@src/application/services/invites.service'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { authenticate } from '../middlewares/auth.middleware'

@Controller('invites')
@ClassMiddleware(authenticate)
export class InvitesController {
    /**
     * Creates a new invite
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Invite}
     */
    @Post('')
    public async saveInvite(req: Request, res: Response): Promise<Response> {
        try {
            const invite = new Invite().fromJSON(req.body).asNewEntity()
            invite.status = InviteStatus.PENDING

            const user_context = req.headers.user_context as string
            const result = await invitesService.add(invite, user_context)

            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    @Get('')
    public async getAllInvites(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string
            const filters = { ...req.query, user: user_context }

            const result = await invitesService.getAll(filters)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    @Patch(':invite_id')
    public async updateStatus(req: Request, res: Response): Promise<Response> {
        try {
            const invite = new Invite().fromJSON(req.body).asNewEntity()
            invite.id = req.params.invite_id
            const user_context = req.headers.user_context as string

            const result = await invitesService.update(invite, user_context)

            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    @Delete(':invite_id')
    public async deleteInvite(req: Request, res: Response): Promise<Response> {
        try {
            const user_context = req.headers.user_context as string
            const result = await invitesService.remove(req.params.invite_id, user_context)
            return res.status(HttpStatus.NO_CONTENT).send({})
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }
}
