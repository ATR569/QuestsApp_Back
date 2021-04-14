import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface';

export class Questionnaire extends Entity implements IJSONTransformable<Questionnaire> {
    private _disciplina?: string
    private _questions?: Array<Object> // Array<Questions>

    public get disciplina(): string | undefined {
        return this._disciplina
    }

    public set disciplina(disciplina: string | undefined) {
        this._disciplina = disciplina
    }

    public get questions(): Array<Object> | undefined {
        return this._questions
    }

    public set questions(questions: Array<Object> | undefined) {
        this._questions = questions
    }

    public toJSON(): object {
        return {
            id: this.id,
            disciplina: this.disciplina,
            questions: this.questions
        }
    }

    public fromJSON(json: any): Questionnaire {
        if (json.id) this.id = json.id
        if (json.disciplina) this.disciplina = json.disciplina
        if (json.questions) this.questions = json.questions

        return this
    }

    public asNewEntity(): Questionnaire {
        this.id = undefined
        return this
    }
}