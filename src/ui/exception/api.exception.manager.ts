import { ApiException } from './api.exception'
import * as ex from '@src/application/domain/exception/exceptions'
import HTTPStatus from 'http-status-codes'

export abstract class ApiExceptionManager {

    public static build(err: ex.Exception): ApiException {
        if (err instanceof ex.ValidationException)
            return new ApiException(HTTPStatus.BAD_REQUEST, err.message, err.description)
        else if (err instanceof ex.ConflictException)
            return new ApiException(HTTPStatus.CONFLICT, err.message, err.description)
        else if (err instanceof ex.NotFoundException)
            return new ApiException(HTTPStatus.NOT_FOUND, err.message, err.description)
        else if (err instanceof ex.UnauthorizedException)
            return new ApiException(HTTPStatus.UNAUTHORIZED, err.message, err.description)
        else if (err instanceof ex.ForbiddenException)
            return new ApiException(HTTPStatus.FORBIDDEN, err.message, err.description)
        else
            return new ApiException(HTTPStatus.INTERNAL_SERVER_ERROR, err.message, err.description)
    }
}
