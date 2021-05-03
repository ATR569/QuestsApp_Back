import { ValidationException } from '../exception/exceptions'
import { Group } from '../model/group'
import { Messages } from '@src/utils/messages'
import { ObjectIdValidator } from './object.id.validator'

export abstract class GroupValidator {

    public static validateCreate(group: Group): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (group.name === undefined) missingFields.push('name')
            else if (group.name === '') {
                throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.ERROR_MESSAGE.INVALID_FIELDS_DESC.replace('{0}', 'name'))
            }

            if (group.administrator === undefined) {
                missingFields.push('administrator')
            } else if (group.administrator.id === undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.GROUPS.ADMIN_ID_NOT_PROVIDED)
            } else {
                try {
                    ObjectIdValidator.validate(group.administrator.id)
                } catch (err) {
                    throw new ValidationException(Messages.GROUPS.INVALID_ADMINISTRATOR_ID,
                        Messages.ERROR_MESSAGE.INVALID_ID_DESC)
                }
            }

            if (missingFields.length > 0) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', missingFields.join(', ')))
            }
        } catch (err) {
            throw err
        }
    }

    public static validateUpdate(group: Group): void | ValidationException {
        const invalidFields: Array<string> = []

        try {
            if (group.id !== undefined) {
                if (group.id === '') invalidFields.push('id')
                else ObjectIdValidator.validate(group.id)
            }
            if (group.name !== undefined && group.name === '') invalidFields.push('name')
            if (group.administrator !== undefined) {
                if (group.administrator.id === undefined) {
                    throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                        Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', 'administrator.id'))
                } else {
                    try {
                        ObjectIdValidator.validate(group.administrator.id)
                    } catch (err) {
                        throw new ValidationException(Messages.GROUPS.INVALID_ADMINISTRATOR_ID,
                            Messages.ERROR_MESSAGE.INVALID_ID_DESC)
                    }
                }
            }

            if (group.members !== undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.GROUPS.FIELD_CANT_UPDATED.replace('{0}', 'members'))
            }

            if (group.questionnaires !== undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.GROUPS.FIELD_CANT_UPDATED.replace('{0}', 'questionnaires'))
            }

            if (invalidFields.length > 0) {
                throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.ERROR_MESSAGE.INVALID_FIELDS_DESC.replace('{0}', invalidFields.join(', ')))
            }
        } catch (err) {
            throw err
        }
    }

}