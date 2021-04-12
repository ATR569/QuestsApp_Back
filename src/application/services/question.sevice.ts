import { IService } from '@src/application/port/service.interface';


export class UsersService implements IService<String> {

    public async add(item: String): Promise<String> {
        return Promise.resolve('Answer save with success')
    }
    public async getAll(filters: object): Promise<String[]> {
        return Promise.resolve(['All Questions'])
    }
    public async getById(id: string): Promise<String> {
        return Promise.resolve('Question')
    }
    public async update(item: String): Promise<String> {
        return Promise.resolve('Question updated with success')
    }
    public async remove(id: string): Promise<String> {
        return Promise.resolve('Question removed with success')
    }
}
