import { Group } from '../domain/model/group';
import { IService } from '../port/service.interface'

class GroupsService implements IService<Group> {

    public async add(group: Group): Promise<Group> {
        group.id = "asd123asd123asd13asd32"
        group.administrator = {id: "a7s8d1a925d612asd1s2aa", name: 'Adson Macedo'}
        group.members = [{id: "a7s8d1a925d612asd1s2aa", name: 'Adson Macedo'}]
        group.questionnaires = []
        return Promise.resolve(group)
    }

    public async getAll(filters: object): Promise<Group[]> {
        return Promise.reject(new Error('Method not implemented. Get all Groups'))
    }

    public async getById(id: string): Promise<Group> {
        return Promise.reject(new Error('Method not implemented. Get group by id'))
    }

    public async update(group: Group): Promise<Group> {
        return Promise.reject(new Error('Method not implemented. Update group by id'))
    }

    public async remove(id: string): Promise<Group> {
        return Promise.reject(new Error('Method not implemented. Remove group'))
    }

    public async getAllQuestionnaires(filters: object): Promise<Array<object>> {
        return Promise.reject(new Error('Method not implemented. Get all questionnaires from group'))
    }

}

export const groupsService = new GroupsService()