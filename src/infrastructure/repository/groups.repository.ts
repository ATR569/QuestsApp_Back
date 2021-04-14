import { Group } from '@src/application/domain/model/group'
import { IRepository } from '@src/application/port/repository.interface'
import { GroupEntity, GroupEntityMapper } from '../entity/group.entity'
import { GroupRepoModel } from '../database/schema/groups.schema'
import { RepositoryException } from '@src/application/domain/exception/exceptions'
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
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR))
                })
        })
    }

    public async find(filters: object): Promise<Group[]> {
        throw new Error('Method not implemented.')
    }

    public async findOne(id: string): Promise<Group> {
        return new Promise<Group>((resolve, reject) => {
            this._groupRepoModel.findOne({ _id: id })
                .then((result: any) => {
                    const group: any = this._groupEntityMapper.transform(result)
                    return resolve(group)
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR))
                })
        })
    }

    public async update(item: Group): Promise<Group> {
        throw new Error('Method not implemented.')
    }

    public async delete(id: string): Promise<Group> {
        throw new Error('Method not implemented.')
    }

    public async count(filters: object): Promise<number> {
        throw new Error('Method not implemented.')
    }

    public async checkExist(group: Group): Promise<boolean> {
        const filters = {name: group.name}

        return new Promise<boolean>((resolve, reject) => {
            this._groupRepoModel.findOne(filters)
                // .then((result: any) => console.log(result))
                .then((result: any) => resolve(!!result))
                .catch((err: any) => reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR)))
        })
    }
}

export const groupsRepository: GroupsRepository = new GroupsRepository()