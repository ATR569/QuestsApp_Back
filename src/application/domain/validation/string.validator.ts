import { ValidationException } from '../exception/exceptions'
import { Messages } from '@src/utils/messages'

export abstract class StringValidator {
    
    public static validate(str: string, fieldName: string): void | ValidationException {

        if (str === '') {
            throw new ValidationException(
                Messages.ERROR_MESSAGE.INVALID_FIELDS,
                Messages.ERROR_MESSAGE.EMPTY_STRING.replace('{0}', fieldName)
            )
        }

    }
}