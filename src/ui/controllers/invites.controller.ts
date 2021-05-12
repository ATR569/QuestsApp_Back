import HttpStatus from 'http-status-codes'
import { Controller, Delete, Get, Patch, Post } from '@overnightjs/core'
import { Invite, InviteStatus } from '@src/application/domain/model/invite'
import { Request, Response } from 'express'
import { invitesService } from '@src/application/services/invites.service'
import { ApiExceptionManager } from '../exception/api.exception.manager'

@Controller('invites')
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

            const result = await invitesService.add(invite)

            return res.status(HttpStatus.CREATED).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    @Get('')
    public async getAllInvites(req: Request, res: Response): Promise<Response> {
        try {
            const filters = { ...req.query }
            const result = await invitesService.getAll(filters)
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        }
    }

    @Patch(':invite_id')
    public async updateStatus(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.OK).send([new Invite().fromJSON(req.body).toJSON()])
    }

    @Delete(':invite_id')
    public async deleteInvite(req: Request, res: Response): Promise<Response> {
        return res.status(HttpStatus.NO_CONTENT).send({})
    }

}