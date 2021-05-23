import { IService } from '@src/application/port/service.interface'
import { User } from '../domain/model/user'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { UserValidator } from '../domain/validation/user.validator'
import { ConflictException, ForbiddenException } from '../domain/exception/exceptions'
import { Messages } from '@src/utils/messages'
import { ObjectIdValidator } from '../domain/validation/object.id.validator'

class UsersService implements IService<User> {

    public async add(user: User): Promise<User> {
        try {
            UserValidator.validateCreate(user)

            if ((await usersRepository.checkExist({ email: user.email }))) {
                throw new ConflictException(Messages.USERS.DUPLICATED, Messages.USERS.DUPLICATED_DESC)
            }

            return usersRepository.create(user)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    public async getAll(filters: object): Promise<Array<User>> {
        return Promise.reject(new Error('Method not implemented. Get all users'))
    }

    public async getById(id: string, user_context: string): Promise<User> {
        try {
            ObjectIdValidator.validate(id)

            await this.checkForbidden(id, user_context)

            return usersRepository.findOne(id)
        } catch (err) {
            console.log('aqui')
            return Promise.reject(err)
        }
    }

    public async update(user: User, user_context: string): Promise<User> {
        try {
            UserValidator.validateUpdate(user)

            await this.checkForbidden(user.id!, user_context)

            return usersRepository.update(user)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    public async remove(id: string): Promise<User> {
        return Promise.reject(new Error('Method not implemented. Remove user by id'))
    }

    public async getAllQuestionnaires(user_id: string): Promise<object> {
        return Promise.reject(new Error('Method not implemented. Get all user questionnaires'))
    }

    public async getAllGroups(user_id: string): Promise<object> {
        return Promise.reject(new Error('Method not implemented. Get all user groups'))
    }

    public async updatePassword(user_id: string, old_password: string, new_password: string, user_context: string): Promise<boolean> {
        try {
            UserValidator.validateChangePassword(user_id, old_password, new_password)

            await this.checkForbidden(user_id, user_context)

            return usersRepository.updatePassword(user_id, old_password, new_password)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    private async checkForbidden(user_id: string, user_context: string): Promise<void> {
        if (user_id !== user_context)
            throw new ForbiddenException(Messages.ERROR_MESSAGE.FORBIDDEN, Messages.ERROR_MESSAGE.FORBIDDEN_DESC)
    }

    private generateForbiddenExceptionMessage(): ForbiddenException {
        throw new ForbiddenException(Messages.ERROR_MESSAGE.FORBIDDEN, Messages.ERROR_MESSAGE.FORBIDDEN_DESC)
    }
}

export const userService = new UsersService()
