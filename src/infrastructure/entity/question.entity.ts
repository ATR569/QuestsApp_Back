import { Answer } from '@src/application/domain/model/answer'
import { Question } from '@src/application/domain/model/question'
import { User } from '@src/application/domain/model/User'
import { IEntityMapper } from './entity.mapper.interface'

export class QuestionEntity {
    public id?: string
    public description?: string
    public creator?: string
    public answers?: Array<string>
}

/**
 * Class for convertions between { Question } and { QuestionEntity }
 */
export class QuestionEntityMapper implements IEntityMapper<Question, QuestionEntity>{

    public transform(item: any): Question | QuestionEntity {
        if (item instanceof Question) return this.modelToEntityModel(item)
        return this.jsonToModel(item)
    }

    public modelToEntityModel(model: Question): QuestionEntity {
        const result = new QuestionEntity()

        if (model.id !== undefined) result.id = model.id
        if (model.description !== undefined) result.description = model.description
        if (model.creator !== undefined && model.creator.id !== undefined)
            result.creator = model.creator.id

        if (model.answers !== undefined) {
            const answers: Array<string> = []
            model.answers.forEach(ans => { if (ans.id != undefined) answers.push(ans.id) })

            result.answers = answers
        }

        return result
    }

    public jsonToModel(json: any): Question {
        const question: Question = new Question()

        if (json.id) question.id = json.id
        if (json.description) question.description = json.description

        if (json.creator) question.creator = new User().fromJSON(json.creator)

        if (json.answers && json.answers instanceof Array) 
            question.answers = json.answers.map((ans: any) => new Answer().fromJSON(ans))

        return question
    }

}