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
            Messages.ERROR_MESSAGE.INVALID_FIELDS_DESC.replace('{0}', 'name')).toJSON(),
        ERROR_400_INVALID_ADMINISTRATOR_ID: new ApiException(HttpStatus.BAD_REQUEST, Messages.GROUPS.INVALID_ADMINISTRATOR_ID,
            Messages.ERROR_MESSAGE.INVALID_ID_DESC).toJSON(),
        ERROR_404_ADMINISTRATOR_NOT_REGISTERED: new ApiException(HttpStatus.NOT_FOUND, Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
            Messages.GROUPS.ADMIN_ID_NOT_REGISTERED).toJSON(),
        ERROR_404_GROUP_NOT_FOUND: new ApiException(HttpStatus.NOT_FOUND, Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'grupo').replace('{1}', '111111111111111111111111')).toJSON(),
        ERROR_400_INVALID_ID: new ApiException(HttpStatus.BAD_REQUEST, Messages.ERROR_MESSAGE.INVALID_ID,
            Messages.ERROR_MESSAGE.INVALID_ID_DESC).toJSON(),
        ERROR_400_MEMBERS_CANT_BE_APDATED: new ApiException(HttpStatus.BAD_REQUEST, Messages.ERROR_MESSAGE.INVALID_FIELDS,
            Messages.GROUPS.FIELD_CANT_UPDATED.replace('{0}', 'members')).toJSON(),
        ERROR_400_QUESTIONNAIRES_CANT_BE_APDATED: new ApiException(HttpStatus.BAD_REQUEST, Messages.ERROR_MESSAGE.INVALID_FIELDS,
            Messages.GROUPS.FIELD_CANT_UPDATED.replace('{0}', 'questionnaires')).toJSON(),
        ERROR_400_ADMIN_CANT_BE_REMOVED: new ApiException(HttpStatus.BAD_REQUEST, Messages.GROUPS.MEMBER_NOT_REMOVED,
            Messages.GROUPS.ADMIN_CANT_BE_REMOVED).toJSON(),
    }

    public static readonly INVITE: any = {
        ERROR_409_ALREADY_EXISTING_INVITE: new ApiException(HttpStatus.CONFLICT,
            Messages.INVITES.ALREADY_REGISTERED).toJSON(),
        ERROR_409_USER_ALREADY_IN_GROUP: new ApiException(HttpStatus.CONFLICT,
            Messages.GROUPS.USER_IS_ALREADY_A_MEMBER).toJSON(),
        ERROR_404_USER_NOT_REGISTERED: new ApiException(HttpStatus.NOT_FOUND,
            Messages.ERROR_MESSAGE.MSG_NOT_FOUND, Messages.INVITES.USER_ID_NOT_REGISTERED).toJSON(),
        ERROR_404_GROUP_NOT_REGISTERED: new ApiException(HttpStatus.NOT_FOUND,
            Messages.ERROR_MESSAGE.MSG_NOT_FOUND, Messages.INVITES.GROUP_ID_NOT_REGISTERED).toJSON(),
        ERROR_400_INVALID_USER_ID: new ApiException(HttpStatus.BAD_REQUEST,
            Messages.INVITES.INVALID_USER_ID, Messages.ERROR_MESSAGE.INVALID_ID_DESC).toJSON(),
        ERROR_400_INVALID_GROUP_ID: new ApiException(HttpStatus.BAD_REQUEST,
            Messages.INVITES.INVALID_GROUP_ID, Messages.ERROR_MESSAGE.INVALID_ID_DESC).toJSON(),
        ERROR_400_USER_ID_NOT_PROVIDED: new ApiException(HttpStatus.BAD_REQUEST,
            Messages.ERROR_MESSAGE.REQUIRED_FIELDS, Messages.INVITES.USER_ID_NOT_PROVIDED).toJSON(),
        ERROR_400_GROUP_ID_NOT_PROVIDED: new ApiException(HttpStatus.BAD_REQUEST,
            Messages.ERROR_MESSAGE.REQUIRED_FIELDS, Messages.INVITES.GROUP_ID_NOT_PROVIDED).toJSON(),
    }
}