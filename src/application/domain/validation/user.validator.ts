import { ValidationException } from '../exception/exceptions'
import { User } from '../model/user'
import { Messages } from '@src/utils/messages'
import { ObjectIdValidator } from './object.id.validator'

export abstract class UserValidator {

    public static validateCreate(user: User): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (!user.name) missingFields.push('name')
            if (!user.email) missingFields.push('email')
            if (!user.password) missingFields.push('password')
            if (!user.institution) missingFields.push('institution')

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
        const invalidFields: Array<string> = []
        let userIsEmpty: boolean = true

        try {
            if (user.id !== undefined) {
                ObjectIdValidator.validate(user.id)
            }

            if (user.email !== undefined) {
                throw new ValidationException(
                    Messages.USERS.EMAIL_NOT_REQUIRED,
                    Messages.USERS.EMAIL_NOT_REQUIRED_DESC
                )
            }

            if (user.password !== undefined) {
                throw new ValidationException(
                    Messages.USERS.PASSWORD_NOT_REQUIRED,
                    Messages.USERS.PASSWORD_NOT_REQUIRED_DESC
                )
            }

            if (user.name !== undefined) {
                userIsEmpty = false
                if (user.name === '') invalidFields.push('name')
            }
            if (user.email !== undefined) {
                userIsEmpty = false
                if (user.email === '') invalidFields.push('email')
            }
            if (user.institution !== undefined) {
                userIsEmpty = false
                if (user.institution === '') invalidFields.push('institution')
            }

            if (userIsEmpty) {
                throw new ValidationException(
                    Messages.USERS.ALL_MISSING_FIELDS,
                    Messages.USERS.ALL_MISSING_FIELDS_DESC
                )
            } else if (invalidFields.length > 0) {
                throw new ValidationException(
                    Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.ERROR_MESSAGE.INVALID_FIELDS_DESC.replace('{0}', invalidFields.join(', '))
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