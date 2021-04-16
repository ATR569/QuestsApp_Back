import { User } from '@src/application/domain/model/user'
import { IEntityMapper } from './entity.mapper.interface'

export class UserEntity {
    public id?: string
    public name?: string
    public email?: string
    public password?: string
    public institution?: string
}

/**
 * Class for convertions between { User } and { UserEntity }
 */
export class UserEntityMapper implements IEntityMapper<User, UserEntity>{

    public transform(item: any): User | UserEntity {
        if (item instanceof User) return this.modelToEntityModel(item)
        return this.jsonToModel(item)
    }

    public modelToEntityModel(model: User): UserEntity {
        const result = new UserEntity()

        if (model.id !== undefined) result.id = model.id
        if (model.name !== undefined) result.name = model.name
        if (model.email !== undefined) result.email = model.email
        if (model.password !== undefined) result.password = model.password
        if (model.institution !== undefined) result.institution = model.institution

        return result
    }

    public jsonToModel(json: any): User {
        const user: User = new User()

        if (json.id) user.id = json.id
        if (json.name) user.name = json.name
        if (json.email) user.email = json.email
        if (json.institution) user.institution = json.institution 

        return user
    }

}