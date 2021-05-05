import { Answer } from '@src/application/domain/model/answer'
import { AnswerComment } from '@src/application/domain/model/answer.comment'
import { User } from '@src/application/domain/model/User'
import { IEntityMapper } from './entity.mapper.interface'

export class AnswerEntity {
    public id?: string
    public description?: string
    public creator?: string
    public score?: Number
    public question_id?: string
    public answerComments?: Array<string>
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
        if (model.creator !== undefined && model.creator.id !== undefined)
        result.creator = model.creator.id
        if (model.score !== undefined) result.score = model.score
        if (model.questionID !== undefined) result.question_id = model.questionID
        if (model.answerComments !== undefined) {
            const answerComments: Array<string> = []
            model.answerComments.forEach(comm => { if (comm.id != undefined) answerComments.push(comm.id) })

            result.answerComments = answerComments
        }
        

        return result
    }

    public jsonToModel(json: any): Answer {
        const answer: Answer = new Answer()

        if (json.id) answer.id = json.id
        if (json.description) answer.description = json.description
        if (json.creator) answer.creator = new User().fromJSON(json.creator)

        if (json.score) answer.score = json.score
        if (json.questionID) answer.questionID = json.questionID
        if (json.answerComments && json.answerComments instanceof Array)
            answer.answerComments = json.answerComments.map((comm: any) => new Answer().fromJSON(comm))
        return answer
    }

}