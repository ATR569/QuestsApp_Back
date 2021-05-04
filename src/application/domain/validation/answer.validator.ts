import { ValidationException } from '../exception/exceptions'
import { Answer } from '../model/answer'
import { Messages } from '@src/utils/messages'
import { ObjectIdValidator } from './object.id.validator'

export abstract class AnswerValidator {

    public static validateCreate(answer: Answer): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (answer.description === undefined) missingFields.push('description')

            if (missingFields.length > 0) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', missingFields.join(', ')))
            }
        } catch (err) {
            throw err
        }
    }

    public static validateUpdate(answer: Answer): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (answer.id === undefined) missingFields.push('id')
            if (answer.description === undefined) missingFields.push('description')
                

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