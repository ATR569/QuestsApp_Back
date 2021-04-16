import { User } from '@src/application/domain/model/user'
import { IRepository } from '@src/application/port/repository.interface'
import { UserEntityMapper } from '../entity/user.entity'
import { UserRepoModel } from '../database/schema/user.schema'
import { Exception, NotFoundException, RepositoryException, ValidationException } from '@src/application/domain/exception/exceptions'
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
                }).catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async find(filters: object): Promise<User[]> {
        throw new Error('Method not implemented.')
    }

    public async findOne(id: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this._userRepoModel.findById(id)
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'user').replace('{id}, id')))
                    }

                    const user: any = this._userEntityMapper.transform(result)
                    return resolve(user)
                }).catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async updatePassword(user_id: string, old_password: string, new_password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._userRepoModel.findById(user_id)
                .then((user: any) => {
                    if (!user) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'user').replace('{id}, id')))
                    }

                    if (user.password === old_password) {
                        return this._userRepoModel.findByIdAndUpdate(user_id, { password: new_password })
                            .then((result: any) => {
                                if (!result) {
                                    return reject(false)
                                }

                                return resolve(true)
                            }).catch((err: any) => {
                                reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                            })
                    }

                    reject(new ValidationException(Messages.USERS.OLD_PASSWORD_NOT_MATCH, Messages.USERS.OLD_PASSWORD_NOT_MATCH_DESC))
                }).catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async update(user: User): Promise<User> {
        const userUp = this._userEntityMapper.transform(user)

        return new Promise<User>((resolve, reject) => {
            this._userRepoModel.findByIdAndUpdate(user.id, userUp)
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'user').replace('{id}, id')))
                    }

                    return resolve(this.findOne(result.id))
                }).catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async delete(id: string): Promise<User> {
        throw new Error('Method not implemented.')
    }

    public async count(filters: object): Promise<number> {
        throw new Error('Method not implemented.')
    }

    public async checkExist(filters: object): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._userRepoModel.findOne(filters)
                .then((result: any) => resolve(!!result))
                .catch((err: any) => reject(new RepositoryException(Messages.USERS.DUPLICATED)))
        })
    }

}

export const usersRepository: UsersRepository = new UsersRepository()