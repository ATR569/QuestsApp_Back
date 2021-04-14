import { Group } from '@src/application/domain/model/group'
import { User } from '@src/application/domain/model/User'
import { IEntityMapper } from './entity.mapper.interface'

export class GroupEntity {
    public id?: string
    public name?: string
    public administrator_id?: string
    public members?: Array<string>
    public questionnaires?: Array<string>
}

/**
 * Class for convertions between { Group } and { GroupEntity }
 */
export class GroupEntityMapper implements IEntityMapper<Group, GroupEntity>{

    public transform(item: any): Group | GroupEntity {
        if (item instanceof Group) return this.modelToEntityModel(item)
        return this.jsonToModel(item)
    }

    public modelToEntityModel(model: Group): GroupEntity {
        const result = new GroupEntity()

        if (model.id !== undefined) result.id = model.id
        if (model.name !== undefined) result.name = model.name
        if (model.administrator !== undefined && model.administrator.id !== undefined)
            result.administrator_id = model.administrator.id

        if (model.members !== undefined) {
            const members: Array<string> = []
            model.members.forEach(member => { if (member.id != undefined) members.push(member.id) })

            result.members = members
        }

        if (model.questionnaires !== undefined) {
            const questionnaires: Array<string> = []
            model.questionnaires.forEach(quest => { if (quest.id != undefined) questionnaires.push(quest.id) })

            result.questionnaires = questionnaires
        }

        return result
    }

    public jsonToModel(json: any): Group {
        const group: Group = new Group()

        if (json.id) group.id = json.id
        if (json.name) group.name = json.name
        //  TO DO
        if (json.administrator_id) group.administrator = new User().fromJSON({id: json.administrator_id})
        if (json.members && json.members instanceof Array) 
            group.members = json.members.map((member: any) => new User().fromJSON(member))
        if (json.questionnaires && json.questionnaires instanceof Array) 
            group.questionnaires = json.questionnaires.map((member: any) => new User().fromJSON(member))

        return group
    }

}