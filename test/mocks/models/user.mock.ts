import { User } from '@src/application/domain/model/User'
import { ObjectID } from 'bson'

export class UserMock extends User {
    constructor() {
        super()
        this.generateUser()
    }

    private generateUser(): void {
        this.id = new ObjectID().toHexString()
        this.name = 'fulano'
        this.email = 'fulano@questsapp.com'
        this.password = 'fulano123'
        this.institution = 'institution'
    }

    public toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            institution: this.institution
        }
    }
}