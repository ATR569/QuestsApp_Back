import { ValidationException } from '../exception/exceptions'
import { Answer } from '../model/answer'
import { Messages } from '@src/utils/messages'
import { ObjectIdValidator } from './object.id.validator'

export abstract class AnswerValidator {

    public static validateCreate(answer: Answer): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            if (answer.description === undefined) missingFields.push('description')
            if (answer.creator === undefined) {
                missingFields.push('creator')

            } else if (answer.creator.id === undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ANSWERS.CREATOR_ID_NOT_PROVIDED)
            } else {
                try {
                    ObjectIdValidator.validate(answer.creator.id)
                } catch (err) {
                    throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                        Messages.ERROR_MESSAGE.INVALID_ID)
                }
            }

            if (answer.questionID === undefined) {
                missingFields.push('questionID')

            } else if (answer.questionID === undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ANSWERS.CREATOR_ID_NOT_PROVIDED)
            } else {
                try {
                    ObjectIdValidator.validate(answer.questionID)
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