import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface'
import { AnswerComment } from './answer.comment'
import { User } from './User'

export class Answer extends Entity implements IJSONTransformable<Answer> {

    private _description?: string
    private _creator?: User
    private _score?: number
    private _questionID?: string
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

    set questionID(questionID: string | undefined){
        this._questionID = questionID
    }

    get questionID(): string | undefined{
        return this._questionID
    }

    get creator() : User | undefined{
        return this._creator
    }

    set creator(creator: User | undefined) {
        this._creator = creator
    }


    public toJSON(): object {
        const json = {
            id: this.id,
            creator: this.creator,
            description: this.description,
            score: this.score,
            questionID: this.questionID,
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
        if (json.creator !== undefined) this.creator = json.creator
        if (json.score !== undefined) this.score = json.score
        if (json.questionID !== undefined) this.questionID = json.questionID
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