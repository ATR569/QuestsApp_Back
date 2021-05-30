import { AuthValidator } from '@src/application/domain/validation/auth.validator'
import { authRepository } from '@src/infrastructure/repository/auth.repository'
import { Messages } from '@src/utils/messages'
import { UnauthorizedException } from '../domain/exception/exceptions'
import { User } from '../domain/model/user'

class AuthService {

    public async authenticate(email: string, password: string): Promise<object> {

        try {
            AuthValidator.validate(email, password)

            const result = await authRepository.authenticate(email, password)

            return Promise.resolve(result)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    public async getPayloadFromToken(token: string | undefined): Promise<User | undefined> {
        try {
            if (token === undefined) 
                throw new UnauthorizedException(Messages.AUTH.UNAUTHORIZED)

            return await authRepository.getPayloadFromToken(token)
        } catch (err) {
            throw new UnauthorizedException(Messages.AUTH.UNAUTHORIZED)
        }
    }
}

export const authService = new AuthService()
