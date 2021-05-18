import { NextFunction, Request, Response } from 'express'
import { authService } from '@src/application/services/auth.service'
import { ApiExceptionManager } from '../exception/api.exception.manager'

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers.authorization?.split('Bearer ')[1]
    await authService.getPayloadFromToken(token)
        .then(user => {
            if (user !== undefined)
                req.headers.user_context = user.id
            next()
        })
        .catch(err => {
            const apiException = ApiExceptionManager.build(err)
            return res.status(apiException.code).send(apiException)
        })
}
