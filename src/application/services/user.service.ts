import { IService } from '@src/application/port/service.interface'
import { User } from '../domain/model/User'

class UsersService implements IService<User> {

    public async add(user: User): Promise<User> {
        user.id = '8d12a961a1s2asda725dsa'

        return Promise.resolve(user)
    }

    public async getAll(filters: object): Promise<Array<User>> {
        return Promise.reject(new Error('Method not implemented. Get all users'))
    }

    public async getById(id: string): Promise<User> {
        const createUser = {
            id: '8d12a961a1s2asda725dsa',
            name: 'Ramon Rodrigues',
            email: 'rrsales@email.com',
            password: 'discorrasobrecienciadacomputacao123',
            institution: 'UEPB'
        }

        return Promise.resolve(new User().fromJSON(createUser))
    }
    public async update(user: User): Promise<User> {
        return Promise.reject(new Error('Method not implemented. Update user by id'))
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