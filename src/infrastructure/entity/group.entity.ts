import { Group } from '@src/application/domain/model/group'
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
        // if (model.administrator !== undefined) result.administrator_id = model.administrator.id   // TODO User model
        // if (model.members !== undefined) result.members = model.members.map(member => member.id)  //  TODO User model
        // if (model.questionnaires !== undefined) result.questionnaires = model.questionnaires.map(quest => quest.id)  //  TODO Questionnaire model

        return result
    }

    public jsonToModel(json: any): Group {
        return new Group().fromJSON(json)
    }

}