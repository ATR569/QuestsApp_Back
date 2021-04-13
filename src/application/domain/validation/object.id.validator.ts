import { ValidationException } from '../exception/exceptions'
import { Messages } from '@src/utils/messages'

export abstract class ObjectIdValidator {
    
    public static validate(id: string): void | ValidationException {

        if (!(/^[a-fA-F0-9]{24}$/.test(id))) {
            throw new ValidationException(
                Messages.ERROR_MESSAGE.INVALID_ID,
                Messages.ERROR_MESSAGE.INVALID_ID_DESC
            )
        }

    }
}