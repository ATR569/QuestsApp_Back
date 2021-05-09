import { Invite } from '../domain/model/invite'
import { InviteValidator } from '../domain/validation/invite.validator'
import { IService } from '../port/service.interface'
import { invitesRepository } from '@src/infrastructure/repository/invites.repository'
import { ConflictException, NotFoundException } from '../domain/exception/exceptions'
import { Messages } from '@src/utils/messages'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { groupsRepository } from '@src/infrastructure/repository/groups.repository'

class InvitesService implements IService<Invite> {
    public async add(invite: Invite): Promise<Invite> {
        try {
            //  Validate the Invite
            InviteValidator.validateCreate(invite)

            //  Check duplicate
            if ((await invitesRepository.checkExist(invite)))
                throw new ConflictException(Messages.INVITES.ALREADY_REGISTERED.replace('{0}', Invite.name))

            //  Check if the user is registered
            if (invite.user !== undefined && invite.user.id !== undefined) {
                if (!(await usersRepository.checkExist({ _id: invite.user.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.INVITES.USER_ID_NOT_REGISTERED)
            }

            //  Check if the group is registered
            if (invite.group !== undefined && invite.group.id !== undefined) {
                if (!(await groupsRepository.checkExist({ _id: invite.group.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.INVITES.GROUP_ID_NOT_REGISTERED)
            }

            //  Creates the invite
            return invitesRepository.create(invite)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object): Promise<Array<Invite>> {
        throw new Error('Method not implemented. service.getAll')
    }

    public async getById(id: string): Promise<Invite> {
        throw new Error('Method not implemented. service.getById')
    }

    public async update(invite: Invite): Promise<Invite> {
        throw new Error('Method not implemented. service.update')
    }

    public async remove(id: string): Promise<Invite> {
        throw new Error('Method not implemented. service.remove')
    }

}

export const invitesService = new InvitesService()