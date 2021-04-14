import { Group } from '@src/application/domain/model/group'
import { IRepository } from '@src/application/port/repository.interface'
import { GroupEntityMapper } from '../entity/group.entity'
import { GroupRepoModel } from '../database/schema/groups.schema'

class GroupsRepository implements IRepository<Group> {
    constructor(
        private readonly _groupEntityMapper: GroupEntityMapper = new GroupEntityMapper(),
        private readonly _groupRepoModel: any = GroupRepoModel
    ) { }

    public create(group: Group): Promise<Group> {
        const newGroup = this._groupEntityMapper.transform(group)

        return new Promise<Group>((resolve, reject) => {
            this._groupRepoModel.create(newGroup)
                .then((result: any) => {
                    return resolve(group)
                }).catch((err: any) => reject(err))
        })  
    }

    public async find(filters: object): Promise<Group[]> {
        throw new Error('Method not implemented.')
    }

    public async findOne(id: string): Promise<Group> {
        throw new Error('Method not implemented.')
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

}

export const groupsRepository: GroupsRepository = new GroupsRepository()