import HttpStatus from 'http-status-codes'
import { Invite, InviteStatus } from '../domain/model/invite'
import { InviteValidator } from '../domain/validation/invite.validator'
import { IService } from '../port/service.interface'
import { invitesRepository } from '@src/infrastructure/repository/invites.repository'
import { ConflictException, ForbiddenException, NotFoundException } from '../domain/exception/exceptions'
import { Messages } from '@src/utils/messages'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { groupsRepository } from '@src/infrastructure/repository/groups.repository'
import { ObjectIdValidator } from '../domain/validation/object.id.validator'
import { User } from '../domain/model/user'

class InvitesService implements IService<Invite> {
    public async add(invite: Invite, user_context: string): Promise<Invite> {
        try {
            //  Validate the Invite
            InviteValidator.validateCreate(invite)

            //  Check if the user is registered
            if (invite !== undefined && invite.user !== undefined) {
                await usersRepository.findOneByEmail(invite.user.email)
                    .then((user: User) => invite.user!.id = user.id)
            }

            //  Check if the group is registered
            if (invite.group !== undefined) {
                if (!(await groupsRepository.checkExist({ _id: invite.group.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.INVITES.GROUP_ID_NOT_REGISTERED)
            }

            //  Check duplicate
            if ((await invitesRepository.checkExistInvite(invite)))
                throw new ConflictException(Messages.INVITES.ALREADY_REGISTERED)

            //  Check if the user alread belongs to the group
            if ((await groupsRepository.checkMember(invite.group!.id!, invite.user!.id!)))
                throw new ConflictException(Messages.GROUPS.USER_IS_ALREADY_A_MEMBER)

           await  this.checkForbidden(invite.group!.id!, user_context)
            //  Creates the invite
            return invitesRepository.create(invite)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object): Promise<Array<Invite>> {
        try {
            return invitesRepository.find(filters)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(id: string): Promise<Invite> {
        throw new Error('Method not implemented. service.getById')
    }

    public async update(invite: Invite, user_context: string): Promise<Invite> {
        try {
            //  Validate the Invite
            InviteValidator.validateUpdate(invite)

            //  Check exist invite by id and status
            if (!(await invitesRepository.checkExistByIdAndStatus(invite.id!, InviteStatus.PENDING)))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND, Messages.INVITES.NOT_FOUND)

            //  Check if the user_context is the invited user
            if (user_context !== invite.user!.id)
                this.generateForbiddenExceptionMessage()

            //  Update the invite
            return invitesRepository.update(invite)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string, user_context: string): Promise<Invite> {
        try {
            ObjectIdValidator.validate(id)

            await invitesRepository.findOne(id)
                .then(async invite => {
                    await this.checkForbidden(invite.group!.id!, user_context)
                })
                .catch(err => {
                    if (!(err instanceof NotFoundException)) throw err
                })
                

            return invitesRepository.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private async checkForbidden(group_id: string, user_context: string): Promise<void> {
        await this.isAdminOf(group_id, user_context)
            .then(result => {
                if (!result) this.generateForbiddenExceptionMessage()
            })
            .catch(err => {
                throw err
            })
    }

    private async isAdminOf(groupId: string, userId: string): Promise<boolean> {
        if (!(await groupsRepository.checkExist({ _id: groupId })))
            throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'grupo').replace('{1}', groupId))

        return groupsRepository.checkAdmin(groupId, userId)
    }

    private generateForbiddenExceptionMessage(): ForbiddenException {
        throw new ForbiddenException(Messages.ERROR_MESSAGE.FORBIDDEN, Messages.ERROR_MESSAGE.FORBIDDEN_DESC)
    }
}

export const invitesService = new InvitesService()