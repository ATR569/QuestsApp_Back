import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface'

export class AnswerComment extends Entity implements IJSONTransformable<AnswerComment> {
    private _description?: string
    private _score?: number
    private _answer_id?: string

    set description(description: string | undefined) {
        this._description = description
    }

    set score(score: number | undefined) {
        this._score = score
    }

    get description(): string | undefined{
        return this._description
    }

    get score(): number | undefined{
        return this._score
    }

    set answer_id(answer_id: string | undefined){
        this._answer_id = answer_id
    }

    get question_id(): string | undefined{
        return this._answer_id
    }

    public toJSON(): object {
        const json = {
            id: this.id,
            description: this.description,
            score: this.score,
            answer_id: this.answer_id
        }

        return json
    }
    
    public fromJSON(json: any): AnswerComment {
        if (json === undefined) {
            json = {}
        }

        if (json.id !== undefined) this.id = json.id
        if (json.description !== undefined) this.description = json.description
        if (json.score !== undefined) this.score = json.score
        if (json.answer_id !== undefined) this.answer_id = json.answer_id

        return this
    }
}