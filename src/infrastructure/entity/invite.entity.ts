import { Group } from '@src/application/domain/model/group'
import { Invite } from '@src/application/domain/model/invite'
// import { User } from '@src/application/domain/model/User'
import { IEntityMapper } from './entity.mapper.interface'
import { UserEntityMapper } from './user.entity'
import { GroupEntityMapper } from './group.entity'

export class InviteEntity {
    public id?: string
    public group?: string
    public user?: string
    public status?: string
    public date?: string
}

/**
 * Class for convertions between { Invite } and { InviteEntity }
 */
export class InviteEntityMapper implements IEntityMapper<Invite, InviteEntity>{

    public transform(item: any): Invite | InviteEntity {
        if (item instanceof Invite) return this.modelToEntityModel(item)
        return this.jsonToModel(item)
    }

    public modelToEntityModel(model: Invite): InviteEntity {
        const inviteEntity = new InviteEntity()

        if (model.id !== undefined) inviteEntity.id = model.id
        if (model.group !== undefined && model.group.id !== undefined) inviteEntity.group = model.group.id
        if (model.user !== undefined && model.user.id !== undefined) inviteEntity.user = model.user.id
        if (model.status !== undefined) inviteEntity.status = model.status
        inviteEntity.date = new Date().toISOString()

        return inviteEntity
    }

    public jsonToModel(json: any): Invite {
        const invite = new Invite()

        if (json.id !== undefined) invite.id = json.id
        if (json.group !== undefined) invite.group = new GroupEntityMapper().jsonToModel(json.group)
        if (json.user !== undefined) invite.user = new UserEntityMapper().jsonToModel(json.user)
        if (json.status !== undefined) invite.status = json.status
        if (json.date !== undefined) invite.date = json.date

        return invite
    }

}
