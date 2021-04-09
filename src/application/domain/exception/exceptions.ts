export abstract class Exception extends Error {
    public description?: string

    protected constructor(message: string, description?: string){
        super(message)
        this.description = description
    }
}

export class NotFoundException extends Exception {
    constructor(message: string, description?: string){
        super(message, description)
    }
}

export class ConflictException extends Exception {
    constructor(message: string, description?: string){
        super(message, description)
    }
}

export class RepositoryException extends Exception {
    constructor(message: string, description?: string){
        super(message, description)
    }
}

export class ValidationException extends Exception {
    constructor(message: string, description?: string){
        super(message, description)
    }
}