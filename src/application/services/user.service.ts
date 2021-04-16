import { IService } from '@src/application/port/service.interface'
import { User } from '../domain/model/User'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { ConflictException } from '../domain/exception/exceptions'
import { Messages } from '@src/utils/messages'

class UsersService implements IService<User> {

    public async add(user: User): Promise<User> {

        if ((await usersRepository.checkExist(user))) {
            throw new ConflictException(Messages.USERS.DUPLICATED)
        }
            

        return usersRepository.create(user)
    }

    public async getAll(filters: object): Promise<Array<User>> {
        return Promise.reject(new Error('Method not implemented. Get all users'))
    }

    public async getById(id: string): Promise<User> {
        return usersRepository.findOne(id)
    }
    public async update(user: User): Promise<User> {
        return usersRepository.update(user)
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

    public async updatePassword(new_password: string): Promise<String> {
        return Promise.reject(new Error('Method not implemented. Update password'))
    }
}

export const userService = new UsersService()