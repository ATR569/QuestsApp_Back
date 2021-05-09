import { AnswerComment } from '@src/application/domain/model/answer.comment'
import { IRepository } from '@src/application/port/repository.interface'
import { GroupEntityMapper } from '../entity/group.entity'
import { AnswerRepoModel } from '../database/schema/answer.schema'
import { AnswerCommentRepoModel } from '../database/schema/answer.comment.schema'
import { NotFoundException, RepositoryException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'
import { AnswerCommentEntityMapper } from '../entity/answerComment.entity'

class AnswerCommentRepository implements IRepository<AnswerComment> {
    constructor(
        private readonly _answerCommentEntityMapper: AnswerCommentEntityMapper = new AnswerCommentEntityMapper(),
        private readonly _answerCommentRepoModel: any = AnswerCommentRepoModel,
        private readonly _answerRepoModel: any = AnswerRepoModel
    ) { }

    public async create(answerComment: AnswerComment): Promise<AnswerComment> {
        const answerId = answerComment.answerId
        const newAnswerComment = this._answerCommentEntityMapper.transform(answerComment)

        return new Promise<AnswerComment>((resolve, reject) => {
            this._answerCommentRepoModel.create(newAnswerComment)
                .then(async (result: any) => {
                    await this._answerRepoModel.findByIdAndUpdate(answerId, { $push: { answerComments: result.id } })

                    return resolve(this.findOne(result.id))
                }).catch((err: any) => reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR)))
        })
    }

    public async find(filters: object): Promise<AnswerComment[]> {
        return new Promise<Array<AnswerComment>>((resolve, reject) => {
            this._answerCommentRepoModel.find(filters)
                .populate('author')
                .then((result: any) => {
                    return resolve(result.map((item: any) => this._answerCommentEntityMapper.transform(item)))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async findOne(id: string): Promise<AnswerComment> {
        return new Promise<AnswerComment>((resolve, reject) => {
            this._answerCommentRepoModel.findOne({ _id: id })
                .populate('author')
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'comentário').replace('{1}', id)))
                    }

                    const answerComment: any = this._answerCommentEntityMapper.transform(result)
                    return resolve(answerComment)
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async update(answerComment: AnswerComment): Promise<AnswerComment> {
        const answerCommentUpd = this._answerCommentEntityMapper.transform(answerComment)

        return new Promise<AnswerComment>((resolve, reject) => {
            this._answerCommentRepoModel.findByIdAndUpdate(answerComment.id, answerCommentUpd)
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'grupo').replace('{1}', answerComment.id)))
                    }

                    return resolve(this.findOne(result.id))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async delete(id: string): Promise<AnswerComment> {
        return new Promise<AnswerComment>((resolve, reject) => {
            this._answerCommentRepoModel.findOneAndDelete({ _id: id })
                .then((result: any) => {
                    return resolve(new AnswerComment())
                })
                .catch((err: any) => {
                    reject(err)
                })
        })
    }

    public async count(filters: object): Promise<number> {
        throw new Error('Method not implemented.')
    }

    public async checkExist(filters: object): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this._answerCommentRepoModel.findOne(filters)
                .then((result: any) => resolve(!!result))
                .catch((err: any) => reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR)))
        })
    }
}

export const answerCommentRepository: AnswerCommentRepository = new AnswerCommentRepository()