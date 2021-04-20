import { ValidationException } from '../exception/exceptions'
import { Question } from '../model/question'
import { Messages } from '@src/utils/messages'
import { ObjectIdValidator } from './object.id.validator'

export abstract class QuestionValidator {

    public static validateCreate(question: Question): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (question.description === undefined) missingFields.push('description')
            if (question.creator === undefined) {
                missingFields.push('creator')

            } else if (question.creator.id === undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.QUESTIONS.CREATOR_ID_NOT_PROVIDED)
            } else {
                try {
                    ObjectIdValidator.validate(question.creator.id)
                } catch (err) {
                    throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                        Messages.ERROR_MESSAGE.INVALID_ID)
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