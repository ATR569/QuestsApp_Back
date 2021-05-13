import { AnswerComment } from '@src/application/domain/model/answer.comment'
import { User } from '@src/application/domain/model/User'
import { IEntityMapper } from './entity.mapper.interface'

export class AnswerCommentEntity {
    public id?: string
    public comment?: string
    public author?: string
    public answerId?: string
}

export class AnswerCommentEntityMapper implements IEntityMapper<AnswerComment, AnswerCommentEntity>{
    transform(item: any): AnswerComment | AnswerCommentEntity {
        if (item instanceof AnswerComment) return this.modelToEntityModel(item)
        return this.jsonToModel(item)
    }

    modelToEntityModel(model: AnswerComment): AnswerCommentEntity {
        const result = new AnswerCommentEntity()

        if (model.id !== undefined) result.id = model.id
        if (model.comment !== undefined) result.comment = model.comment
        if (model.author !== undefined && model.author.id !== undefined)
            result.author = model.author.id
        if (model.answerId !== undefined) result.answerId = model.answerId

        return result
    }

    jsonToModel(json: any): AnswerComment {
        const answerComment: AnswerComment = new AnswerComment()

        if (json.id) answerComment.id = json.id
        if (json.comment) answerComment.comment = json.comment
        if (json.author) answerComment.author = new User().fromJSON(json.author)
        if (json.answerId) answerComment.answerId = json.answerId

        return answerComment
    }
}