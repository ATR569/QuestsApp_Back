import { Group } from '../domain/model/group';
import { IService } from '../port/service.interface'
import { groupsRepository } from '@src/infrastructure/repository/groups.repository'
import { GroupValidator } from '../domain/validation/group.validator';
import { ConflictException } from '../domain/exception/exceptions';
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';

class GroupsService implements IService<Group> {

    public async add(group: Group): Promise<Group> {
        try {
            GroupValidator.validateCreate(group)

            if ((await groupsRepository.checkExist(group)))
                throw new ConflictException(Messages.GROUPS.ALREADY_REGISTERED.replace('{0}', group.name))

            return groupsRepository.create(group)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object): Promise<Array<Group>> {
        const createdGroup = {
            id: '8d12a961a1s2asda725dsa',
            name: "Grupo ATRJ",
            administrator: { id: "a7s8d1a925d612asd1s2aa", name: "Adson Macedo" },
            members: [
                { id: "a7s8d1a925d612asd1s2aa", name: "Adson Macedo" }
            ],
            questionnaires: []
        }

        const groups: Array<Group> = [
            new Group().fromJSON(createdGroup)
        ]

        return Promise.resolve(groups)
    }

    public async getById(group_id: string): Promise<Group> {
        ObjectIdValidator.validate(group_id)

        return groupsRepository.findOne(group_id)
    }

    public async update(group: Group): Promise<Group> {
        return Promise.reject(new Error('Method not implemented. Update group by id'))
    }

    public async remove(group_id: string): Promise<Group> {
        return Promise.reject(new Error('Method not implemented. Remove group'))
    }

    public async getAllQuestionnaires(group_id: string): Promise<Array<object>> {
        return Promise.reject(new Error('Method not implemented. Get all questionnaires from group'))
    }

}

export const groupsService = new GroupsService()