import { Group } from '../domain/model/group';
import { IService } from '../port/service.interface'
import { groupsRepository } from '@src/infrastructure/repository/groups.repository'

class GroupsService implements IService<Group> {

    public async add(group: Group): Promise<Group> {
        return groupsRepository.create(group)
        // group.id = '8d12a961a1s2asda725dsa'
        // return Promise.resolve(group)
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
        return Promise.reject(new Error('Method not implemented. Get group by id'))
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