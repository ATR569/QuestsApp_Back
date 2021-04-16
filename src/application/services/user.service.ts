import { IService } from '@src/application/port/service.interface'
import { User } from '../domain/model/user'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { UserValidator } from '../domain/validation/user.validator'
import { ConflictException } from '../domain/exception/exceptions'
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

    public async getById(id: string): Promise<User> {
        ObjectIdValidator.validate(id)

        return usersRepository.findOne(id)
    }

    public async update(user: User): Promise<User> {
        try {
            UserValidator.validateUpdate(user)

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

    public async updatePassword(user_id: string, old_password: string, new_password: string): Promise<boolean> {
        try {
            UserValidator.validateChangePassword(user_id, old_password, new_password)

            return usersRepository.updatePassword(user_id, old_password, new_password)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export const userService = new UsersService()