import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface'

export class AnswerComment extends Entity implements IJSONTransformable<AnswerComment> {
    private _description?: string
    private _score?: number

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

    public toJSON(): object {
        const json = {
            id: this.id,
            description: this.description,
            score: this.score
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

        return this
    }
}