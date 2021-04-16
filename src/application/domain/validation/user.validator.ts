import { ValidationException } from '../exception/exceptions'
import { User } from '../model/user'
import { Messages } from '@src/utils/messages'
import { ObjectIdValidator } from './object.id.validator'

export abstract class UserValidator {

    public static validateCreate(user: User): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (user.name === undefined) missingFields.push('name')
            if (user.email === undefined) missingFields.push('email')
            if (user.password === undefined) missingFields.push('password')
            if (user.institution === undefined) missingFields.push('institution')

            if (missingFields.length > 0) {
                throw new ValidationException(
                    Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', missingFields.join(', '))
                )
            }
        } catch (err) {
            throw err
        }
    }

    public static validateUpdate(user: User): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (user.id != undefined) {
                ObjectIdValidator.validate(user.id)
            }

            if (user.password != undefined) {
                throw new ValidationException(
                    Messages.USERS.PASSWORD_NOT_REQUIRED,
                    Messages.USERS.PASSWORD_NOT_REQUIRED_DESC
                )
            }

            if (user.name === undefined && user.email === undefined && user.institution === undefined) {
                missingFields.push('name', 'email', 'institution')
            }

            if (missingFields.length > 0) {
                throw new ValidationException(
                    Messages.USERS.ALL_MISSING_FIELDS,
                    Messages.USERS.ALL_MISSING_FIELDS_DESC.replace('{0}', missingFields.join(', '))
                )
            }

        } catch (err) {
            throw err
        }
    }

    public static validateChangePassword(user_id: string, old_password: string, new_password: string): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (user_id != undefined) {
                ObjectIdValidator.validate(user_id)
            }

            if (old_password === undefined) missingFields.push('old_password')
            if (new_password === undefined) missingFields.push('new_password')

            if (missingFields.length > 0) {
                throw new ValidationException(
                    Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', missingFields.join(', '))
                )
            }
        } catch (err) {
            throw err
        }
    }

}