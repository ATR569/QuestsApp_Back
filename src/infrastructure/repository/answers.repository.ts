import { Answer} from '@src/application/domain/model/answer'
import { IRepository } from '@src/application/port/repository.interface'
import { AnswerEntityMapper } from '../entity/answer.entity'
import { AnswerRepoModel } from '../database/schema/answer.schema'
import { NotFoundException, RepositoryException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'
import { QuestionRepoModel } from '../database/schema/questions.schema'

class AnswersRepository implements IRepository<Answer> {
    constructor(
        private readonly _answerEntityMapper: AnswerEntityMapper = new AnswerEntityMapper(),
        private readonly _answerRepoModel: any = AnswerRepoModel,
        private readonly _questionRepoModel: any = QuestionRepoModel
    ) { }

    public async create(answer: Answer): Promise<Answer> {
        const questionid = answer.question_id
        const newAnswer = this._answerEntityMapper.transform(answer)
        newAnswer.score = 0
        
        console.log(newAnswer)
        return new Promise<Answer>((resolve, reject) => {
            
            this._answerRepoModel.create(newAnswer)
                .then((result: any) => {
                    console.log(questionid + 'id da questao')
                    const update = { $push: { answers: result._id} }
                    
                    this._questionRepoModel.findOneAndUpdate({ _id: questionid }, update, { new: true })
                    return resolve(this.findOne(result.id))
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR))
                })
        })
    }

    public async find(filters: object): Promise<Answer[]> {
        return new Promise<Array<Answer>>((resolve, reject) => {
            this._answerRepoModel.find(filters)
                .populate('comments')
                .then((result: any) => {
                    return resolve(result.map((item: any) => this._answerEntityMapper.transform(item)))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async findOne(id: string): Promise<Answer> {
        return new Promise<Answer>((resolve, reject) => {
            this._answerRepoModel.findOne({ _id: id })
                .populate('comments')
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'reposta').replace('{id}', id)))
                    }

                    const answer: any = this._answerEntityMapper.transform(result)
                    return resolve(answer)
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async update(answer: Answer): Promise<Answer> {
        const answerUpd = this._answerEntityMapper.transform(answer)
        const update = { $inc: { score: 1 }}    
        return new Promise<Answer>((resolve, reject) => {
            
            this._answerRepoModel.findOneAndUpdate({ _id: answerUpd.id }, update, { new: true })
                .then((result: any) => {
                    if (!result)
                        return reject(new NotFoundException(
                            Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND
                                .replace('{recurso}', 'answer')
                                .replace('{score}', answerUpd.score))
                        )
                    
                    return resolve(answer)
                })
                .catch((err: any) => reject(err))
        })
    }

    public async delete(id: string): Promise<Answer> {
        return new Promise<Answer>((resolve, reject) => {
            this._answerRepoModel.findOneAndDelete({ _id: id })
                .then((result: any) => {
                    return resolve(new Answer())
                })
                .catch((err: any) => reject(err))
        })
    }

    public async count(filters: object): Promise<number> {
        return this._answerRepoModel.count()
    }

    public async checkExist(filters: object): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this._answerRepoModel.findOne(filters)
                // .then((result: any) => console.log(result))
                .then((result: any) => resolve(!!result))
                .catch((err: any) => reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR)))
        })
    }
}

export const answersRepository: AnswersRepository = new AnswersRepository()