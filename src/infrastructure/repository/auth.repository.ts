import jwt from 'jsonwebtoken'
import { UserRepoModel } from '../database/schema/user.schema'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { NotFoundException, RepositoryException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'
import { User } from '@src/application/domain/model/user'
import { AuthEntityMapper } from '../entity/auth.entity'
import { ApiException } from '@src/ui/exception/api.exception'
import HttpStatus from 'http-status-codes';

require('dotenv').config()

class AuthRepository {

    constructor(
        private readonly _authEntityMapper: AuthEntityMapper = new AuthEntityMapper(),
        private readonly _userRepoModel: any = UserRepoModel,
        private readonly _userRepository: any = usersRepository
    ) { }

    public authenticate(email: string, password: string): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            this._userRepoModel.findOne({ email })
                .then((result: any) => {

                    if (!result) {
                        return reject(new NotFoundException(Messages.AUTH.MSG_NOT_FOUND,
                            Messages.AUTH.DESC_NOT_FOUND))
                    }

                    if (result.email === email) {
                        const user: any = this._authEntityMapper.transform(result)

                        if (this._userRepository.comparePasswords(password, user.password)) {
                            return resolve({ access_token: this.generateAccesssToken(user) })
                        }
                    }

                    reject(new ApiException(HttpStatus.UNAUTHORIZED, Messages.AUTH.UNAUTHORIZED, Messages.AUTH.UNAUTHORIZED_DESC))
                }).catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public generateAccesssToken(user: User): string {
        const private_key = process.env.JWT_SECRET_KEY || "chavePadrao567244"

        const payload: object = {
            sub: user.id,
            iss: "questsapp",
            user: user,
        }

        return jwt.sign(payload, private_key, { expiresIn: '1d' })
    }

}

export const authRepository: AuthRepository = new AuthRepository()