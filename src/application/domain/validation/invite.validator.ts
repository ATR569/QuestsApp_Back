import { Messages } from '@src/utils/messages'
import { ValidationException } from '../exception/exceptions'
import { Invite } from '../model/invite'
import { ObjectIdValidator } from './object.id.validator'
import { InviteStatus } from '../model/invite'
import { StringValidator } from './string.validator'

export abstract class InviteValidator {
    public static validateCreate(invite: Invite): void | ValidationException {
        const missingFields: Array<string> = []

        try {
            // Validate invite.group
            if (invite.group === undefined) missingFields.push('group')
            else if (invite.group.id === undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.INVITES.GROUP_ID_NOT_PROVIDED)
            } else {
                try {
                    ObjectIdValidator.validate(invite.group.id)
                } catch (err) {
                    throw new ValidationException(Messages.INVITES.INVALID_GROUP_ID,
                        Messages.ERROR_MESSAGE.INVALID_ID_DESC)
                }
            }

            // Validate invite.user
            if (invite.user === undefined) missingFields.push('user')
            else if (invite.user.email === undefined) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.INVITES.USER_ID_NOT_PROVIDED)
            } else {
                try {
                    StringValidator.validate(invite.user.email, 'email')
                } catch (err) {
                    throw new ValidationException(Messages.INVITES.INVALID_USER_ID,
                        Messages.ERROR_MESSAGE.INVALID_ID_DESC)
                }
            }

            // Validate status
            if (invite.status === undefined) missingFields.push('status')
            else if (!Object.values(InviteStatus).includes(invite.status))
                throw new ValidationException(Messages.INVITES.INVALID_STATUS,
                    Messages.INVITES.INVALID_STATUS_DESC)

            if (missingFields.length > 0) {
                throw new ValidationException(Messages.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Messages.ERROR_MESSAGE.REQUIRED_FIELDS_DESC.replace('{0}', missingFields.join(', ')))
            }
        } catch (err) {
            throw err
        }
    }

    public static validateUpdate(invite: Invite): void | ValidationException {
        try {
            if (invite.id !== undefined) {
                if (invite.id === '') {
                    throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                        Messages.ERROR_MESSAGE.INVALID_FIELDS_DESC.replace('{0}', 'id'))
                    }
            }

            //  Validate status
            if (invite.status !== undefined) {
                if (!Object.values(InviteStatus).includes(invite.status))
                    throw new ValidationException(Messages.INVITES.INVALID_STATUS,
                        Messages.INVITES.INVALID_STATUS_DESC)
            }

            //  Validate fields that cant be updated
            if (invite.group !== undefined){
                throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.INVITES.FIELD_CANT_UPDATED.replace('{0}', 'group'))
            }

            if (invite.user !== undefined){
                throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.INVITES.FIELD_CANT_UPDATED.replace('{0}', 'user'))
            }

            if (invite.date !== undefined){
                throw new ValidationException(Messages.ERROR_MESSAGE.INVALID_FIELDS,
                    Messages.INVITES.FIELD_CANT_UPDATED.replace('{0}', 'date'))
            }
        } catch (err) {
            throw err
        }
    }
}
