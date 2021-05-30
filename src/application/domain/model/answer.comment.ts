import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface'
import { User } from './User'

export class AnswerComment extends Entity implements IJSONTransformable<AnswerComment> {
    private _comment?: string
    private _answerId?: string
    private _author?: User

    set comment(comment: string | undefined) {
        this._comment = comment
    }

    set answerId(answerId: string | undefined) {
        this._answerId = answerId
    }

    set author(author: User | undefined) {
        this._author = author
    }

    get comment(): string | undefined {
        return this._comment
    }

    get answerId(): string | undefined {
        return this._answerId
    }

    get author(): User | undefined {
        return this._author
    }

    public toJSON(): object {
        return {
            id: this.id,
            comment: this.comment,
            answerId: this.answerId,
            author: this.author
        }
    }

    public fromJSON(json: any): AnswerComment {
        if (json.id !== undefined) this.id = json.id
        if (json.comment !== undefined) this.comment = json.comment
        if (json.answerId !== undefined) this.answerId = json.answerId
        if (json.author !== undefined) this.author = json.author

        return this
    }

    public asNewEntity(): AnswerComment {
        this.id = undefined
        return this
    }
}