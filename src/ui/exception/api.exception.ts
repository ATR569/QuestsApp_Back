import { Exception } from '@src/application/domain/exception/exceptions'

export class ApiException extends Exception {
    public code: number

    constructor (code: number, message: string, description?: string) {
        super(message, description)
        this.code = code
    }

    public toJSON(): object {
        return this.description ? {
            code: this.code,
            message: this.message,
            description: this.description
        } : {
            code: this.code,
            message: this.message,
        }
    }
}