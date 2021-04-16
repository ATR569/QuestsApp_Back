import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface'
import { Question } from './question'

export class Questionnaire extends Entity implements IJSONTransformable<Questionnaire> {
    private _discipline?: string
    private _questions?: Array<Question> // Array<Questions>

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

    public toJSON(): object {
        return {
            id: this.id,
            discipline: this.discipline,
            questions: this.questions
        }
    }

    public fromJSON(json: any): Questionnaire {
        if (json.id) this.id = json.id
        if (json.discipline) this.discipline = json.discipline
        if (json.questions) this.questions = json.questions

        return this
    }

    public asNewEntity(): Questionnaire {
        this.id = undefined
        return this
    }
}