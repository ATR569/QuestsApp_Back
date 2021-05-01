import { Group } from '@src/application/domain/model/group'
import { IRepository } from '@src/application/port/repository.interface'
import { GroupEntityMapper } from '../entity/group.entity'
import { GroupRepoModel } from '../database/schema/groups.schema'
import { NotFoundException, RepositoryException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'

class GroupsRepository implements IRepository<Group> {
    constructor(
        private readonly _groupEntityMapper: GroupEntityMapper = new GroupEntityMapper(),
        private readonly _groupRepoModel: any = GroupRepoModel
    ) { }

    public async create(group: Group): Promise<Group> {
        const newGroup = this._groupEntityMapper.transform(group)

        return new Promise<Group>((resolve, reject) => {
            this._groupRepoModel.create(newGroup)
                .then((result: any) => {
                    return resolve(this.findOne(result.id))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR))
                })
        })
    }

    public async find(filters: object): Promise<Array<Group>> {
        return new Promise<Array<Group>>((resolve, reject) => {
            this._groupRepoModel.find(filters)
                .populate('administrator')
                .populate('members')
                .populate('questionnaires')
                .then((result: any) => {
                    return resolve(result.map((item: any) => this._groupEntityMapper.transform(item)))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async findOne(id: string): Promise<Group> {
        return new Promise<Group>((resolve, reject) => {
            this._groupRepoModel.findOne({ _id: id })
                .populate('administrator')
                .populate('members')
                .populate('questionnaires')
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'grupo').replace('{id}', id)))
                    }

                    const group: any = this._groupEntityMapper.transform(result)
                    return resolve(group)
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async update(group: Group): Promise<Group> {
        const groupUpd = this._groupEntityMapper.transform(group)

        return new Promise<Group>((resolve, reject) => {
            this._groupRepoModel.findByIdAndUpdate(group.id, groupUpd)
                .then((result: any) => {
                    return resolve(this.findOne(result.id))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
            })
    }

    public async delete(id: string): Promise<Group> {
        return new Promise<Group>((resolve, reject) => {
            this._groupRepoModel.findOneAndDelete({ _id: id })
                .then((result: any) => {
                    return resolve(new Group())
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    }

    public async count(filters: object): Promise<number> {
        throw new Error('Method not implemented.')
    }

    public async checkExist(filters: object): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this._groupRepoModel.findOne(filters)
                .then((result: any) => resolve(!!result))
                .catch((err: any) => reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR)))
        })
    }
}

export const groupsRepository: GroupsRepository = new GroupsRepository()