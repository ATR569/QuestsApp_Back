import { ValidationException } from '../exception/exceptions'
import { AnswerComment } from '../model/answer.comment'
import { Messages } from '@src/utils/messages'
import { StringValidator } from './string.validator'
import { ObjectIdValidator } from './object.id.validator'

export abstract class AnswerCommentValidator {

    public static validate(answerComment: AnswerComment): void | ValidationException {
        const missingFields = []

        try {
            if (answerComment.comment == undefined) missingFields.push('disciplina')
            else StringValidator.validate(answerComment.comment, 'discipline')

            if (answerComment.answerId == undefined) missingFields.push('answerId')
            else ObjectIdValidator.validate(answerComment.answerId)

            if (answerComment.author === undefined) {
                missingFields.push('author')
            } else if (answerComment.author.id === undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ANSWERS_COMMENTS.AUTHOR_ID_NOT_PROVIDED)
            } else {
                try {
                    ObjectIdValidator.validate(answerComment.author.id)
                } catch (err) {
                    throw new ValidationException(Messages.ANSWERS_COMMENTS.AUTHOR_ID_NOT_REGISTERED,
                        Messages.ERROR_MESSAGE.INVALID_ID_DESC)
                }
            }

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

    public static validateUpdate(answerComment: AnswerComment): void | ValidationException {
        const invalidFields: Array<string> = []

        try {
            if (answerComment.id !== undefined) {
                if (answerComment.id === '') invalidFields.push('id')
                else ObjectIdValidator.validate(answerComment.id)
            }

            if (answerComment.answerId !== undefined) {
                if (answerComment.answerId === '') invalidFields.push('answerId')
                else ObjectIdValidator.validate(answerComment.answerId)
            }

            if (answerComment.comment !== undefined && answerComment.comment === '') invalidFields.push('comment')

            if (answerComment.author !== undefined) {
                if (answerComment.author.id === undefined) {
                    throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                        Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', 'author.id'))
                } else {
                    try {
                        ObjectIdValidator.validate(answerComment.author.id)
                    } catch (err) {
                        throw new ValidationException(Messages.ANSWERS_COMMENTS.INVALID_AUTHOR_ID,
                            Messages.ERROR_MESSAGE.INVALID_ID_DESC)
                    }
                }
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