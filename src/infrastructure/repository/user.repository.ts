import { User } from '@src/application/domain/model/User'
import { IRepository } from '@src/application/port/repository.interface'
import { UserEntityMapper } from '../entity/user.entity'
import { UserRepoModel } from '../database/schema/user.schema'
import { RepositoryException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'

class UsersRepository implements IRepository<User> {
    constructor(
        private readonly _userEntityMapper: UserEntityMapper = new UserEntityMapper(),
        private readonly _userRepoModel: any = UserRepoModel
    ) { }

    public create(user: User): Promise<User> {
        const newUser = this._userEntityMapper.transform(user)

        return new Promise<User>((resolve, reject) => {
            this._userRepoModel.create(newUser)
                .then((result: any) => {
                    return resolve(this.findOne(result.id))
                }).catch((err: any) => reject(err))
        })
    }

    public async find(filters: object): Promise<User[]> {
        throw new Error('Method not implemented.')
    }

    public async findOne(id: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this._userRepoModel.findById(id)
                .then((result: any) => {
                    const user: any = this._userEntityMapper.transform(result)
                    return resolve(user)
                }).catch((err: any) => {
                    return reject(err)
                })
        })
    }

    public async update(user: User): Promise<User> {
        const userUp = this._userEntityMapper.transform(user)

        return new Promise<User>((resolve, reject) => {
            this._userRepoModel.findByIdAndUpdate(user.id, userUp)
                .then((result: any) => {
                    return resolve(this.findOne(result.id))
                }).catch((err: any) => {
                    return reject(err)
                })
        })
    }

    public async delete(id: string): Promise<User> {
        throw new Error('Method not implemented.')
    }

    public async count(filters: object): Promise<number> {
        throw new Error('Method not implemented.')
    }

    public async checkExist(user: User): Promise<boolean> {
        const filters = { email: user.email }

        return new Promise<boolean>((resolve, reject) => {
            this._userRepoModel.findOne(filters)
                .then((result: any) => resolve(!!result))
                .catch((err: any) => reject(new RepositoryException(Messages.USERS.DUPLICATED)))
        })
    }

}

export const usersRepository: UsersRepository = new UsersRepository()