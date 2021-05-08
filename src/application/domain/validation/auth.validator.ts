import { ValidationException } from '../exception/exceptions'
import { Messages } from '@src/utils/messages'

export class AuthValidator {

    public static validate(email: string, password: string): void | ValidationException {
        const missingFields: Array<string> = []

        if (email === undefined) missingFields.push('email')
        if (password === undefined) missingFields.push('password')

        if (missingFields.length > 0) {
            throw new ValidationException(
                Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', missingFields.join(', '))
            )
        }
    }
}