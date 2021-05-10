import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface'
import { AnswerComment } from './answer.comment'
import { User } from './User'

export class Answer extends Entity implements IJSONTransformable<Answer> {

    private _description?: string
    private _author?: User
    private _score?: number
    private _questionId?: string
    private _answerComments?: Array<AnswerComment>
    

    set description(description: string | undefined) {
        this._description = description
    }

    set score(score: number | undefined) {
        this._score = score
    }

    set answerComments(answerComments: Array<AnswerComment> | undefined) {
        this._answerComments = answerComments
    }

    get description(): string | undefined{
        return this._description
    }

    get score(): number | undefined{
        return this._score
    }

    get answerComments(): Array<AnswerComment> | undefined{
        return this._answerComments
    }

    set questionId(questionId: string | undefined){
        this._questionId = questionId
    }

    get questionId(): string | undefined{
        return this._questionId
    }

    get author() : User | undefined{
        return this._author
    }

    set author(author: User | undefined) {
        this._author = author
    }


    public toJSON(): object {
        const json = {
            id: this.id,
            author: this.author,
            description: this.description,
            score: this.score,
            questionId: this.questionId,
            answerComments: this.answerComments
            
        }

        return json
    }
    
    public fromJSON(json: any): Answer {
        if (json === undefined) {
            json = {}
        }

        if (json.id !== undefined) this.id = json.id
        if (json.description !== undefined) this.description = json.description
        if (json.author !== undefined) this.author = json.author
        if (json.score !== undefined) this.score = json.score
        if (json.questionId !== undefined) this.questionId = json.questionId
        if (json.answerComments !== undefined && json.answerComments instanceof Array) {
            this.answerComments = json.answerComments.map((comment: any) => new AnswerComment().fromJSON(comment))
        }
        
        
        return this
    }

    public asNewEntity(): Answer {
        this.id = undefined
        return this
    }
}