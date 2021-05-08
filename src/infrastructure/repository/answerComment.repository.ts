import { AnswerComment } from '@src/application/domain/model/answer.comment'
import { IRepository } from '@src/application/port/repository.interface'
import { GroupEntityMapper } from '../entity/group.entity'
import { AnswerCommentRepoModel } from '../database/schema/answer.comment.schema'
import { NotFoundException, RepositoryException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'

class AnswerCommentRepository implements IRepository<AnswerComment> {
    create(item: AnswerComment): Promise<AnswerComment> {
        throw new Error('Method not implemented.')
    }
    find(filters: object): Promise<AnswerComment[]> {
        throw new Error('Method not implemented.')
    }
    findOne(id: string): Promise<AnswerComment> {
        throw new Error('Method not implemented.')
    }
    update(item: AnswerComment): Promise<AnswerComment> {
        throw new Error('Method not implemented.')
    }
    delete(id: string): Promise<AnswerComment> {
        throw new Error('Method not implemented.')
    }
    count(filters: object): Promise<number> {
        throw new Error('Method not implemented.')
    }
}