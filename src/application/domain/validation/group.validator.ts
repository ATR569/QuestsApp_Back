import { ValidationException } from '../exception/exceptions'
import { Group } from '../model/group'
import { Messages } from '@src/utils/messages'

export abstract class GroupValidator {

    public static validateCreate(group: Group): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (group.name === undefined) missingFields.push('name')
            if (group.administrator === undefined) missingFields.push('administrator')

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

    public static validateUpdate(group: Group): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (group.id === undefined) missingFields.push('id')
            if (group.name === undefined) missingFields.push('name')
            if (group.administrator === undefined) missingFields.push('administrator')

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