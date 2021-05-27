import { Group } from '../domain/model/group';
import { IService } from '../port/service.interface'
import { groupsRepository } from '@src/infrastructure/repository/groups.repository'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { GroupValidator } from '../domain/validation/group.validator';
import { ConflictException, ForbiddenException, NotFoundException, ValidationException } from '../domain/exception/exceptions';
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';

class GroupsService implements IService<Group> {

    public async add(group: Group, user_context: string): Promise<Group> {
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

                //  Check Forbidden
                if (group.administrator.id !== user_context) this.generateForbiddenExceptionMessage()
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

    public async getById(group_id: string, user_context: string): Promise<Group> {
        try {
            ObjectIdValidator.validate(group_id)

            await this.isMemberOf(user_context, group_id)
                .then(res => { if (!res) this.generateForbiddenExceptionMessage() })

            return await groupsRepository.findOne(group_id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(group: Group, user_context: string): Promise<Group> {
        try {
            GroupValidator.validateUpdate(group)

            //  Check duplicate
            await groupsRepository
                .find({ name: group.name })
                .then(res => {
                    res.forEach(item => {
                        if (item.id !== group.id) {
                            throw new ConflictException(Messages.GROUPS.ALREADY_REGISTERED.replace('{0}', group.name))
                        }
                    })
                })

            //  Check if the user is registered
            if (group.administrator !== undefined) {
                if (!(await usersRepository.checkExist({ _id: group.administrator.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.GROUPS.ADMIN_ID_NOT_REGISTERED)
            }

            //  Check permission
            await this.isAdminOf(user_context, group.id!)
                .then(res => { if (!res) this.generateForbiddenExceptionMessage() })

            return groupsRepository.update(group)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(group_id: string, user_context: string): Promise<Group> {
        try {
            ObjectIdValidator.validate(group_id)

            //  Check permission
            await this.isAdminOf(user_context, group_id)
                .then(res => { if (!res) this.generateForbiddenExceptionMessage() })

            return groupsRepository.delete(group_id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async removeUserFromGroup(group_id: string, member_id: string, user_context: string): Promise<Group> {
        try {
            ObjectIdValidator.validate(group_id)
            ObjectIdValidator.validate(member_id)

            //  Check if the group is registered
            if (!(await groupsRepository.checkExist({ _id: group_id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'grupo').replace('{1}', group_id))

            const isAdmin = await groupsRepository.checkAdmin(group_id, member_id)
            if (isAdmin) {
                throw new ValidationException(Messages.GROUPS.MEMBER_NOT_REMOVED,
                    Messages.GROUPS.ADMIN_CANT_BE_REMOVED)
            }

            //  Check permission
            await this.isAdminOf(user_context, group_id)
                .then(res => { if (!res) this.generateForbiddenExceptionMessage() })

            return groupsRepository.deleteMember(group_id, member_id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async checkNotMemberForbidden(user_id: string, group_id: string): Promise<void> {
        await this.isMemberOf(user_id, group_id)
            .then(res => { if (!res) groupsService.generateForbiddenExceptionMessage() })
    }

    public async checkNotAdminForbidden(user_id: string, group_id: string): Promise<void> {
        await this.isAdminOf(user_id, group_id)
            .then(res => { if (!res) groupsService.generateForbiddenExceptionMessage() })
    }

    public async isMemberOf(user_id: string, group_id: string): Promise<boolean> {
        if (!(await groupsRepository.checkExist({ _id: group_id })))
            throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'grupo').replace('{1}', group_id))

        return groupsRepository.checkMember(group_id, user_id)
    }

    public async isAdminOf(user_id: string, group_id: string): Promise<boolean> {
        if (!(await groupsRepository.checkExist({ _id: group_id })))
            throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'grupo').replace('{1}', group_id))

        return groupsRepository.checkAdmin(group_id, user_id)
    }

    public generateForbiddenExceptionMessage(): ForbiddenException {
        throw new ForbiddenException(Messages.ERROR_MESSAGE.FORBIDDEN, Messages.ERROR_MESSAGE.FORBIDDEN_DESC)
    }
}

export const groupsService = new GroupsService()