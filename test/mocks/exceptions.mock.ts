import { ApiException } from '@src/ui/exception/api.exception'
import HttpStatus from 'http-status-codes'
import { Messages } from '@src/utils/messages'

export abstract class ExceptionsMock {
    public static readonly GROUP: any = {
        ERROR_409_ALREADY_EXISTING_NAME: new ApiException(HttpStatus.CONFLICT,
            Messages.GROUPS.ALREADY_REGISTERED.replace('{0}', 'Group mock')).toJSON(),
        ERROR_400_NAME_NOT_PROVIDED: new ApiException(HttpStatus.BAD_REQUEST, Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
            Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', 'name')).toJSON(),
        ERROR_400_ADMINISTRATOR_NOT_PROVIDED: new ApiException(HttpStatus.BAD_REQUEST, Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
            Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', 'administrator')).toJSON(),
        ERROR_400_EMPTY_NAME: new ApiException(HttpStatus.BAD_REQUEST, Messages.ERROR_MESSAGE.INVALID_FIELDS,
            Messages.ERROR_MESSAGE.EMPTY_STRING.replace('{0}', 'name')).toJSON(),
        ERROR_400_INVALID_ADMINISTRATOR_ID: new ApiException(HttpStatus.BAD_REQUEST, Messages.GROUPS.INVALID_ADMINISTRATOR_ID,
            Messages.ERROR_MESSAGE.INVALID_ID_DESC).toJSON(),
        ERROR_404_ADMINISTRATOR_NOT_REGISTERED: new ApiException(HttpStatus.NOT_FOUND, Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
            Messages.GROUPS.ADMIN_ID_NOT_REGISTERED).toJSON(),
        ERROR_404_GROUP_NOT_FOUND: new ApiException(HttpStatus.NOT_FOUND, Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'grupo').replace('{id}', '111111111111111111111111')).toJSON(),
    }
}