import { NotFoundException, RepositoryException } from '@src/application/domain/exception/exceptions'
import { Invite, InviteStatus } from '@src/application/domain/model/invite'
import { IRepository } from '@src/application/port/repository.interface'
import { Messages } from '@src/utils/messages'
import { InviteRepoModel } from '../database/schema/invite.schema'
import { InviteEntityMapper } from '../entity/invite.entity'

class InvitesRepository implements IRepository<Invite> {
    constructor(
        private readonly _inviteEntityMapper: InviteEntityMapper = new InviteEntityMapper(),
        private readonly _inviteRepoModel: any = InviteRepoModel
    ) { }

    public async create(invite: Invite): Promise<Invite> {
        const newInvite = this._inviteEntityMapper.transform(invite)

        return new Promise<Invite>((resolve, reject) => {
            this._inviteRepoModel.create(newInvite)
                .then((result: any) => {
                    return resolve(this.findOne(result.id))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR))
                })
        })
    }

    public async find(filters: object): Promise<Array<Invite>> {
        return new Promise<Array<Invite>>((resolve, reject) => {
            this._inviteRepoModel.find(filters)
                .populate({
                    path: 'group',
                    populate: [
                        { path: 'administrator' },
                        { path: 'members' },
                        { path: 'questionnaires' }
                    ],
                })
                .populate('user')
                .then((result: any) => {
                    return resolve(result.map((item: any) => this._inviteEntityMapper.transform(item)))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async findOne(id: string): Promise<Invite> {
        return new Promise<Invite>((resolve, reject) => {
            this._inviteRepoModel.findOne({ _id: id })
                .populate({
                    path: 'group',
                    populate: [
                        { path: 'administrator' },
                        { path: 'members' },
                        { path: 'questionnaires' }
                    ],
                })
                .populate('user')
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'convite').replace('{1}', id)))
                    }

                    const invite: any = this._inviteEntityMapper.transform(result)
                    return resolve(invite)
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async update(invite: Invite): Promise<Invite> {
        return new Promise<Invite>((resolve, reject) => {
            this._inviteRepoModel.findByIdAndUpdate(invite.id, { status: invite.status })
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'convite').replace('{1}', invite.id)))
                    }

                    return resolve(this.findOne(result.id))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async delete(id: string): Promise<Invite> {
        return new Promise<Invite>((resolve, reject) => {
            this._inviteRepoModel.findByIdAndDelete(id)
                .then((result: any) => {
                    return resolve(new Invite())
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async count(filters: object): Promise<number> {
        throw new Error('Method not implemented.')
    }

    public async checkExist(filters: object): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._inviteRepoModel.findOne(filters)
                .then((result: any) => {
                    resolve(!!result)
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async checkExistInvite(invite: Invite): Promise<boolean> {
        const filters = {
            group: invite.group?.id,
            user: invite.user?.id,
            status: InviteStatus.PENDING
        }

        return this.checkExist(filters)
    }

    public async checkExistByIdAndStatus(id: string, status: InviteStatus): Promise<boolean> {
        const filters = { _id: id, status: status }
        return this.checkExist(filters)
    }
}

export const invitesRepository = new InvitesRepository()
