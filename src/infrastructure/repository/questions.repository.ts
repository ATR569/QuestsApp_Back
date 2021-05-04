import { Question } from '@src/application/domain/model/question'
import { IRepository } from '@src/application/port/repository.interface'
import { QuestionEntityMapper } from '../entity/question.entity'
import { QuestionRepoModel } from '../database/schema/questions.schema'
import { NotFoundException, RepositoryException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'
import { Answer } from '@src/application/domain/model/answer'

class QuestionsRepository implements IRepository<Question> {
    constructor(
        private readonly _questionEntityMapper: QuestionEntityMapper = new QuestionEntityMapper(),
        private readonly _questionRepoModel: any = QuestionRepoModel
    ) { }

    public async create(question: Question): Promise<Question> {
        const newQuestion = this._questionEntityMapper.transform(question)

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

    public async getAnswers(id: string): Promise<Array<Answer>> {
        return new Promise<Array<Answer>>((resolve, reject) => {
            this._questionRepoModel.findOne({ _id: id })
                .populate('answers')
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'question').replace('{id}', id)))
                    }

                    const question: any = this._questionEntityMapper.transform(result)
                    return resolve(question.answers)
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }



    public async update(question: Question): Promise<Question> {

        const questionUpd = this._questionEntityMapper.transform(question)
        const update = { _description: questionUpd.description}    
        return new Promise<Question>((resolve, reject) => {
            
            this._questionRepoModel.findOneAndUpdate({ _id: questionUpd.id }, update, { new: true })
                .then((result: any) => {
                    if (!result)
                        return reject(new NotFoundException(
                            Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND
                                .replace('{recurso}', 'question')
                                .replace('{description}', questionUpd.description))
                        )
                    
                    return resolve(question)
                })
                .catch((err: any) => reject(err))
        })
    }

    public async delete(id: string): Promise<Question> {
        return new Promise<Question>((resolve, reject) => {

            this._questionRepoModel.findOneAndDelete({ _id: id })
                .then((result: any) => {
                    return resolve(new Question())
                })
                .catch((err: any) => reject(err))
        })
    }

    public async count(filters: object): Promise<number> {
        return this._questionRepoModel.count()
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