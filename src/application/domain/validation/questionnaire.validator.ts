import { ValidationException } from '../exception/exceptions'
import { Questionnaire } from '../model/questionnaire'
import { Messages } from '@src/utils/messages'
import { StringValidator } from './string.validator'
import { ObjectIdValidator } from './object.id.validator'

export abstract class QuestionnaireValidator {

    public static validate(questionnaire: Questionnaire): void | ValidationException {
        const missingFields = []

        try {
            if (questionnaire.discipline == undefined) missingFields.push('disciplina')
            else StringValidator.validate(questionnaire.discipline, 'discipline')

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

    public static validateUpdate(questionnaire: Questionnaire): void | ValidationException {
        const invalidFields: Array<string> = []

        try {
            if (questionnaire.id !== undefined && questionnaire.id === '') invalidFields.push('id')
            if (questionnaire.discipline !== undefined && questionnaire.discipline === '') invalidFields.push('discipline')

            if (invalidFields.length > 0) {
                throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.ERROR_MESSAGE.INVALID_FIELDS_DESC.replace('{0}', invalidFields.join(', ')))
            }

        } catch (err) {
            throw err
        }
    }
}