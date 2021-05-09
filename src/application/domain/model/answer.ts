import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface'
import { AnswerComment } from './answer.comment'

export class Answer extends Entity implements IJSONTransformable<Answer> {

    private _description?: string
    private _score?: number
    private _comments?: Array<AnswerComment>
    private _question_id?: string

    set description(description: string | undefined) {
        this._description = description
    }

    set score(score: number | undefined) {
        this._score = score
    }

    set comments(comments: Array<AnswerComment> | undefined) {
        this._comments = comments
    }

    get description(): string | undefined{
        return this._description
    }

    get score(): number | undefined{
        return this._score
    }

    get comments(): Array<AnswerComment> | undefined{
        return this._comments
    }

    set question_id(question_id: string | undefined){
        this._question_id = question_id
    }

    get question_id(): string | undefined{
        return this._question_id
    }

    public toJSON(): object {
        const json = {
            id: this.id,
            description: this.description,
            score: this.score,
            comments: this.comments,
            question_id: this.question_id
        }

        return json
    }
    
    public fromJSON(json: any): Answer {
        if (json === undefined) {
            json = {}
        }

        if (json.id !== undefined) this.id = json.id
        if (json.description !== undefined) this.description = json.description
        if (json.score !== undefined) this.score = json.score
        if (json.comments !== undefined && json.comments instanceof Array) {
            this.comments = json.comments.map((comment: any) => new AnswerComment().fromJSON(comment))
        }
        if (json.question_id !== undefined) this.question_id = json.question_id
        
        return this
    }

    public asNewEntity(): Answer {
        this.id = undefined
        return this
    }
}