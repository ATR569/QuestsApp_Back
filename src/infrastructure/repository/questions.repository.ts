import { Question } from '@src/application/domain/model/question'
import { IRepository } from '@src/application/port/repository.interface'
import { QuestionEntityMapper } from '../entity/question.entity'
import { QuestionRepoModel } from '../database/schema/questions.schema'
import { NotFoundException, RepositoryException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'

class QuestionsRepository implements IRepository<Question> {
    constructor(
        private readonly _questionEntityMapper: QuestionEntityMapper = new QuestionEntityMapper(),
        private readonly _questionRepoModel: any = QuestionRepoModel
    ) { }

    public async create(question: Question): Promise<Question> {
        const newQuestion = this._questionEntityMapper.transform(Question)

        return new Promise<Question>((resolve, reject) => {
            this._questionRepoModel.create(newQuestion)
                .then((result: any) => {
                    return resolve(this.findOne(result.id))
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR))
                })
        })
    }

    public async find(filters: object): Promise<Question[]> {
        return new Promise<Array<Question>>((resolve, reject) => {
            this._questionRepoModel.find(filters)
                .populate('creator')
                .populate('answers')
                .then((result: any) => {
                    return resolve(result.map((item: any) => this._questionEntityMapper.transform(item)))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async findOne(id: string): Promise<Question> {
        return new Promise<Question>((resolve, reject) => {
            this._questionRepoModel.findOne({ _id: id })
                .populate('creator')
                .populate('answers')
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'question').replace('{id}', id)))
                    }

                    const question: any = this._questionEntityMapper.transform(result)
                    return resolve(question)
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async update(item: Question): Promise<Question> {
        throw new Error('Method not implemented.')
    }

    public async delete(id: string): Promise<Question> {
        throw new Error('Method not implemented.')
    }

    public async count(filters: object): Promise<number> {
        throw new Error('Method not implemented.')
    }

    public async checkExist(filters: object): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this._questionRepoModel.findOne(filters)
                // .then((result: any) => console.log(result))
                .then((result: any) => resolve(!!result))
                .catch((err: any) => reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR)))
        })
    }
}

export const questionsRepository: QuestionsRepository = new QuestionsRepository()