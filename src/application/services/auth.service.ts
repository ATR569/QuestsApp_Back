import { AuthValidator } from '@src/application/domain/validation/auth.validator'
import { authRepository } from '@src/infrastructure/repository/auth.repository'

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
}

export const authService = new AuthService()
