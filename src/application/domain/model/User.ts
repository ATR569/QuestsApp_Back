// import { Entity } from './entity'
// import { IJSONTransformable } from './json.transformer.interface';

export class User {
// export class User extends Entity implements IJSONTransformable<User> {
    private _name?: string
    private _email?: string
    private _password?: string
    private _institution?: string

    get name() : string | undefined{
        return this._name
    }

    set name(name: string | undefined) {
        this._name = name
    }

    get email() : string | undefined{
        return this._email
    }

    set email(email: string | undefined) {
        this._email = email
    }

    get password(): string | undefined {
        return this._password
    }

    set password(password: string | undefined) {
        this._password = password
    }

    get institution(): string | undefined {
        return this._institution
    }

    set institution(institution: string | undefined) {
        this._institution = institution
    }
    
    toJSON(): object {
        return {
            // id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            institution: this.institution
        }
    }
    fromJSON(json: any): User {
        // if (json.id) this.id = json.id
        if (json.name) this.name = json.name
        if (json.email) this.email = json.email
        if (json.password) this.password = json.password
        if (json.institution) this.institution = json.institution

        return this
    }

    // public asNewEntity(): User {
    //     this.id = undefined
    //     return this
    // }
}
