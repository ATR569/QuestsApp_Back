import { ValidationException } from '../exception/exceptions'
import { Questionnaire } from '../model/questionnaire'
import { Messages } from '@src/utils/messages'

export abstract class QuestionnaireValidator {

    public static validate(questionnaire: Questionnaire): void | ValidationException {
        const missingFields = []

        try {
            if (questionnaire.discipline == undefined) missingFields.push('disciplina')

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