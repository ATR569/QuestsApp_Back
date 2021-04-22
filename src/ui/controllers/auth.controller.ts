import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {

    @Post('')
    public async authenticate(req: Request, res: Response): Promise<Response> {
        // TO DO
        return res.send({token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'})
    }

}