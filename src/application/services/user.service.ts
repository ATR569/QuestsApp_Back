import { IService } from '@src/application/port/service.interface'

export class UsersService implements IService<String> {

    public async add(item: String): Promise<String> {
        return Promise.resolve('User add with success')
    }
    public async getAll(filters: object): Promise<String[]> {
        return Promise.resolve(['All users'])
    }
    public async getById(id: string): Promise<String> {
        return Promise.resolve('User')
    }
    public async update(item: String): Promise<String> {
        return Promise.resolve('User updated with success')
    }
    public async remove(id: string): Promise<String> {
        return Promise.resolve('User removed with success')
    }
}