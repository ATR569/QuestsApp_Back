import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface';

export class Question extends Entity implements IJSONTransformable<Question> {
    private _description?: string
    private _creator?: object // User
    private _answers?: Array<object> // Array<Answer>

    get description() : string | undefined{
        return this._description
    }

    set description(description: string | undefined) {
        this._description = description
    }

    get creator() : object | undefined{
        return this._creator
    }

    set creator(creator: object | undefined) {
        this._creator = creator
    }

    get answers() : Array<object> | undefined{
        return this._answers
    }

    set answers(answers: Array<object> | undefined) {
        this.answers = answers
    }
    
    public toJSON(): object {
        return {
            id: this.id,
            description: this.description,
            creator: this.creator,
            answers: this.answers
        }
    }

    public fromJSON(json: any): Question {
        if (json.id) this.id = json.id
        if (json.description) this.description = json.description
        if (json.creator) this.creator = json.creator
        if (json.answers) this.answers = json.answers

        return this
    }

    public asNewEntity(): Question {
        this.id = undefined
        return this
    }

}