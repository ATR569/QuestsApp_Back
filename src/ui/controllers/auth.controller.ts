import { Controller, Post } from '@overnightjs/core';
import { authService } from '@src/application/services/auth.service';
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { ApiException } from '../exception/api.exception';
import { ApiExceptionManager } from '../exception/api.exception.manager';

@Controller('auth')
export class AuthController {

    @Post('')
    public async authenticate(req: Request, res: Response): Promise<Response> {
        try {
            const result: any = await authService.authenticate(req.body.email, req.body.password)

            if (result) {
                return res.status(HttpStatus.OK).send(result)
            }

            return res.status(HttpStatus.UNAUTHORIZED)
                .send(new ApiException(HttpStatus.UNAUTHORIZED, 'E-mail ou senha inválidos'))
        } catch (error) {
            const apiException = ApiExceptionManager.build(error)

            return res.status(apiException.code).send(apiException)
        }
    }
}