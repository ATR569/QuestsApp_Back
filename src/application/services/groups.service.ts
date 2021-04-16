import { Group } from '../domain/model/group';
import { IService } from '../port/service.interface'
import { groupsRepository } from '@src/infrastructure/repository/groups.repository'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { GroupValidator } from '../domain/validation/group.validator';
import { ConflictException, NotFoundException } from '../domain/exception/exceptions';
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';

class GroupsService implements IService<Group> {

    public async add(group: Group): Promise<Group> {
        try {
            //  Validate the group
            GroupValidator.validateCreate(group)

            //  Check duplicate
            if ((await groupsRepository.checkExist({ name: group.name })))
                throw new ConflictException(Messages.GROUPS.ALREADY_REGISTERED.replace('{0}', group.name))

            //  Check if the user is registered
            if (group.administrator !== undefined && group.administrator.id !== undefined) {
                if (!(await usersRepository.checkExist({ _id: group.administrator.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.GROUPS.ADMIN_ID_NOT_REGISTERED)
            }

            //  Creates the group
            return groupsRepository.create(group)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object): Promise<Array<Group>> {
        try {
            return groupsRepository.find(filters)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(group_id: string): Promise<Group> {
        ObjectIdValidator.validate(group_id)

        return groupsRepository.findOne(group_id)
    }

    public async update(group: Group): Promise<Group> {
        try {
            GroupValidator.validateUpdate(group)

            if (!(await groupsRepository.checkExist({ _id: group.id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'grupo').replace('{id}', group.id))
            
            //  Check if the user is registered
            if (group.administrator !== undefined) {
                if (!(await usersRepository.checkExist({ _id: group.administrator.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.GROUPS.ADMIN_ID_NOT_REGISTERED)
            }

            return groupsRepository.update(group)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(group_id: string): Promise<Group> {
        return Promise.reject(new Error('Method not implemented. Remove group'))
    }

    public async getAllQuestionnaires(group_id: string): Promise<Array<object>> {
        return Promise.reject(new Error('Method not implemented. Get all questionnaires from group'))
    }

}

export const groupsService = new GroupsService()