import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface'
import { Question } from './question'

export class Questionnaire extends Entity implements IJSONTransformable<Questionnaire> {
    private _discipline?: string
    private _questions?: Array<Question>
    private _groupId?: string
    private _questionsCount?: number

    public get discipline(): string | undefined {
        return this._discipline
    }

    public set discipline(discipline: string | undefined) {
        this._discipline = discipline
    }

    public get questions(): Array<Question> | undefined {
        return this._questions
    }

    public set questions(questions: Array<Question> | undefined) {
        this._questions = questions
    }

    public get groupId(): string | undefined {
        return this._groupId
    }

    public set groupId(groupId: string | undefined) {
        this._groupId = groupId
    }

    public get questionsCount(): number | undefined {
        return this._questionsCount
    }

    public set questionsCount(questionsCount: number | undefined) {
        this._questionsCount = questionsCount
    }

    public toJSON(): object {
        return (this._questions) ? {
            id: this.id,
            discipline: this.discipline,
            groupId: this.groupId,
            questions: this.questions
        } : {
            id: this.id,
            discipline: this.discipline,
            groupId: this.groupId,
            questionsCount: this.questionsCount
        }
    }

    public fromJSON(json: any): Questionnaire {
        if (json.id !== undefined) this.id = json.id
        if (json.discipline !== undefined) this.discipline = json.discipline
        if (json.questions !== undefined) this.questions = json.questions
        if (json.groupId !== undefined) this.groupId = json.groupId

        return this
    }

    public asNewEntity(): Questionnaire {
        this.id = undefined
        return this
    }
}