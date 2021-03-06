import { NotFoundException, RepositoryException, ValidationException } from '@src/application/domain/exception/exceptions'
import { User } from '@src/application/domain/model/user'
import { IRepository } from '@src/application/port/repository.interface'
import { Messages } from '@src/utils/messages'
import bcrypt from 'bcrypt'
import { UserRepoModel } from '../database/schema/user.schema'
import { UserEntityMapper } from '../entity/user.entity'

class UsersRepository implements IRepository<User> {
    constructor(
        private readonly _userEntityMapper: UserEntityMapper = new UserEntityMapper(),
        private readonly _userRepoModel: any = UserRepoModel
    ) { }

    public create(user: User): Promise<User> {
        const newUser = this._userEntityMapper.transform(user)

        if (newUser.password) {
            newUser.password = this.encryptPassword(newUser.password)
        }

        return new Promise<User>((resolve, reject) => {
            this._userRepoModel.create(newUser)
                .then((result: any) => {
                    return resolve(this.findOne(result.id))
                }).catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public encryptPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
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
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'user').replace('{id}', id)))
                    }

                    const user: any = this._userEntityMapper.transform(result)
                    return resolve(user)
                }).catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public comparePasswords(passwordPlain: string, passwordHash: string): boolean {
        return bcrypt.compareSync(passwordPlain, passwordHash)
    }

    public async updatePassword(user_id: string, old_password: string, new_password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._userRepoModel.findById(user_id)
                .then((user: any) => {
                    if (!user) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'user').replace('{1}', user_id)))
                    }

                    if (this.comparePasswords(old_password, user.password)) {
                        const encriptedNewPassword = this.encryptPassword(new_password)
                        return this._userRepoModel.findByIdAndUpdate(user_id, { password: encriptedNewPassword })
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
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'user').replace('{id}', user.id)))
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

    public async findOneByEmail(email: string | undefined): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this._userRepoModel.findOne({ email: email })
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.USERS.USER_EMAIL_NOT_REGISTERED))
                    }

                    const user: any = this._userEntityMapper.transform(result)
                    return resolve(user)
                }).catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }
}

export const usersRepository: UsersRepository = new UsersRepository()