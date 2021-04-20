import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface';
import { Answer } from './answer'
import { User } from './User'

export class Question extends Entity implements IJSONTransformable<Question> {
    private _description?: string
    private _creator?: User
    private _answers?: Array<Answer> // Array<Answer>

    get description() : string | undefined{
        return this._description
    }

    set description(description: string | undefined) {
        this._description = description
    }

    get creator() : User | undefined{
        return this._creator
    }

    set creator(creator: User | undefined) {
        this._creator = creator
    }

    get answers() : Array<Answer> | undefined{
        return this._answers
    }

    set answers(answers: Array<Answer> | undefined) {
        this._answers = answers
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
        if (json.id !== undefined) this.id = json.id
        if (json.description !== undefined) this.description = json.description
        if (json.creator !== undefined) this.creator = json.creator
        if (json.answers !== undefined) this.answers = json.answers

        return this
    }

    public asNewEntity(): Question {
        this.id = undefined
        return this
    }

}