import { Questionnaire } from '@src/application/domain/model/questionnaire'
import { Question } from '@src/application/domain/model/question'
import { IEntityMapper } from './entity.mapper.interface'

export class QuestionnaireEntity {
    public id?: string
    public discipline?: string
    public groupId?: string
    public questions?: Array<string>
}

export class QuestionnaireEntityMapper implements IEntityMapper<Questionnaire, QuestionnaireEntity>{
    public transform(item: any): Questionnaire | QuestionnaireEntity {
        if (item instanceof Questionnaire) return this.modelToEntityModel(item)
        return this.jsonToModel(item)
    }

    public modelToEntityModel(model: Questionnaire): QuestionnaireEntity {
        const result = new QuestionnaireEntity()

        if (model.id !== undefined) result.id = model.id
        if (model.discipline !== undefined) result.discipline = model.discipline
        if (model.groupId !== undefined) result.groupId = model.groupId

        if (model.questions !== undefined) {
            const questions: Array<string> = []
            model.questions.forEach(q => { if (q.id != undefined) questions.push(q.id) })

            result.questions = questions
        }

        return result
    }

    public jsonToModel(json: any): Questionnaire {
        const questionnaire: Questionnaire = new Questionnaire()

        if (json.id) questionnaire.id = json.id
        if (json.discipline) questionnaire.discipline = json.discipline
        if (json.groupId) questionnaire.groupId = json.groupId
        if (json.questions && json.questions instanceof Array)
            questionnaire.questions = json.questions.map((question: any) => new Question().fromJSON(question))
        if (json.questions_count != undefined) questionnaire.questionsCount = json.questions_count

        return questionnaire
    }
}