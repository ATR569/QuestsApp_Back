import { Answer } from '@src/application/domain/model/answer'
import { AnswerComment } from '@src/application/domain/model/answer.comment'
import { IEntityMapper } from './entity.mapper.interface'

export class AnswerEntity {
    public id?: string
    public description?: string
    public score?: Number
    public comments?: Array<string>
    public question_id?: string
}

/**
 * Class for convertions between { Answer } and { AnswerEntity }
 */
export class AnswerEntityMapper implements IEntityMapper<Answer, AnswerEntity>{

    public transform(item: any): Answer | AnswerEntity {
        if (item instanceof Answer) return this.modelToEntityModel(item)
        return this.jsonToModel(item)
    }

    public modelToEntityModel(model: Answer): AnswerEntity {
        const result = new AnswerEntity()

        if (model.id !== undefined) result.id = model.id
        if (model.description !== undefined) result.description = model.description
        if (model.score !== undefined) result.score = model.score
        if (model.comments !== undefined) {
            const comments: Array<string> = []
            model.comments.forEach(comm => { if (comm.id != undefined) comments.push(comm.id) })

            result.comments = comments
        }
        

        return result
    }

    public jsonToModel(json: any): Answer {
        const answer: Answer = new Answer()

        if (json.id) answer.id = json.id
        if (json.description) answer.description = json.description
        if (json.score) answer.score = json.score
        if (json.comments && json.comments instanceof Array)
            answer.comments = json.comments.map((comm: any) => new Answer().fromJSON(comm))
        if (json.question_id) answer.question_id = json.question_id
        return answer
    }

}