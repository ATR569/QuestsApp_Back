import { ValidationException } from '../exception/exceptions'
import { Answer } from '../model/answer'
import { Messages } from '@src/utils/messages'
import { ObjectIdValidator } from './object.id.validator'

export abstract class AnswerValidator {

    public static validateCreate(answer: Answer): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (answer.description === undefined) missingFields.push('description')
            else if (answer.description === '') {
                throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.ERROR_MESSAGE.INVALID_FIELDS_DESC.replace('{0}', 'description'))
            }

            if (answer.author === undefined) {
                missingFields.push('author')

            } else if (answer.author.id === undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ANSWERS.AUTHOR_ID_NOT_PROVIDED)
            } else {
                try {
                    ObjectIdValidator.validate(answer.author.id)
                } catch (err) {
                    throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                        Messages.ERROR_MESSAGE.INVALID_ID)
                }
            }

            if (answer.questionId === undefined) {
                missingFields.push('questionId')

            } else if (answer.questionId === undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ANSWERS.author_ID_NOT_PROVIDED)
            } else {
                try {
                    ObjectIdValidator.validate(answer.questionId)
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

    public static validateUpdate(answer: Answer): void | ValidationException {
        const invalidFields: Array<string> = []

        try {
            if (answer.id !== undefined){ 
                if (answer.id === '') invalidFields.push('id')
                else ObjectIdValidator.validate(answer.id)
            }
            if (answer.description === undefined || answer.description === '') invalidFields.push('description')
                

            if (invalidFields.length > 0) {
                throw new ValidationException(
                    Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', invalidFields.join(', '))
                )
            }
        } catch (err) {
            throw err
        }
    }

}