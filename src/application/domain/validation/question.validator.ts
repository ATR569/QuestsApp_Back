import { ValidationException } from '../exception/exceptions'
import { Question } from '../model/question'
import { Messages } from '@src/utils/messages'

export abstract class QuestionValidator {

    public static validateCreate(question: Question): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (question.description === undefined) missingFields.push('description')
            if (question.creator === undefined) missingFields.push('creator')

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

    public static validateUpdate(question: Question): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (question.id === undefined) missingFields.push('id')
            if (question.description === undefined) missingFields.push('description')
            if (question.creator === undefined) missingFields.push('creator')

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