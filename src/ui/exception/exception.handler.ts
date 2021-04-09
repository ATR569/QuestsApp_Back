import { ApiException } from './api.exception'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'

export const notFoundHandler = (req: Request, res: Response) => {
    const exception: ApiException = new ApiException(
        HttpStatus.NOT_FOUND,
        'Não encontrado',
        `Não foi possível acessar a url especificada: ${req.url}`
    )

    res.status(HttpStatus.NOT_FOUND).send(exception.toJSON())
}
