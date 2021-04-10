import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface';

export class Group extends Entity implements IJSONTransformable<Group> {
    private _name?: string
    private _administrator?: object // User
    private _members?: Array<object> // Array<User> 
    private _questionnaires?: Array<object> // Array<Questionnaires>

    get name() : string | undefined{
        return this._name
    }

    set name(name: string | undefined) {
        this._name = name
    }

    get administrator() : object | undefined{
        return this._administrator
    }

    set administrator(administrator: object | undefined) {
        this._administrator = administrator
    }

    get members() : Array<object> | undefined{
        return this._members
    }

    set members(members: Array<object> | undefined) {
        this._members = members
    }

    get questionnaires() : Array<object> | undefined{
        return this._questionnaires
    }

    set questionnaires(questionnaires: Array<object> | undefined) {
        this._questionnaires = questionnaires
    }
    
    public toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            administrator: this.administrator,
            members: this.members,
            questionnaires: this.questionnaires
        }
    }

    public fromJSON(json: any): Group {
        if (json.id) this.id = json.id
        if (json.name) this.name = json.name
        if (json.administrator) this.administrator = json.administrator
        if (json.members) this.members = json.members
        if (json.questionnaires) this.questionnaires = json.questionnaires

        return this
    }

    public asNewEntity(): Group {
        this.id = undefined
        return this
    }

}