import { Group } from '@src/application/domain/model/group'
import { Questionnaire } from '@src/application/domain/model/questionnaire'
import { User } from '@src/application/domain/model/User'
import { IEntityMapper } from './entity.mapper.interface'

export class GroupEntity {
    public id?: string
    public name?: string
    public administrator?: string
    public members?: Array<string>
    public questionnaires?: Array<string>
    public questionnaires_count?: number
    public members_count?: number
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
            result.administrator = model.administrator.id

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
        if (json.administrator) group.administrator = new User().fromJSON(json.administrator)
        if (json.members && json.members instanceof Array)
            group.members = json.members.map((member: any) => new User().fromJSON(member))
        if (json.questionnaires && json.questionnaires instanceof Array)
            group.questionnaires = json.questionnaires.map((quest: any) => new Questionnaire().fromJSON(quest))
        if (json.members_count != undefined) group.membersCount = json.members_count
        if (json.questionnaires_count != undefined) group.questionnairesCount = json.questionnaires_count
        return group
    }

}