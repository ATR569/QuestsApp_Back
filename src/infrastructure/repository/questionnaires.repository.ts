import { Questionnaire } from '@src/application/domain/model/questionnaire'
import { Question } from '@src/application/domain/model/question'
import { IRepository } from '@src/application/port/repository.interface'
import { QuestionnaireEntityMapper } from '../entity/questionnaire.entity'
import { QuestionnaireRepoModel } from '../database/schema/questionnaire.schema'
import { GroupRepoModel } from '../database/schema/groups.schema'
import { NotFoundException, RepositoryException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'

class QuestionnaireRepository implements IRepository<Questionnaire> {
    constructor(
        private readonly _questionnaireEntityMapper: QuestionnaireEntityMapper = new QuestionnaireEntityMapper(),
        private readonly _questionnaireRepoModel: any = QuestionnaireRepoModel,
        private readonly _groupRepoModel: any = GroupRepoModel
    ) { }

    public async create(questionnaire: Questionnaire): Promise<Questionnaire> {
        const groupId = questionnaire.groupId
        const newQuestionnaire = this._questionnaireEntityMapper.transform(questionnaire)

        return new Promise<Questionnaire>((resolve, reject) => {
            this._questionnaireRepoModel.create(newQuestionnaire)
                .then(async (result: any) => {
                    await this._groupRepoModel.findByIdAndUpdate(groupId, { $push: { questionnaires: result.id } })

                    return resolve(this.findOne(result.id))
                }).catch((err: any) => reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR)))
        })
    }

    public async find(filters: object): Promise<Questionnaire[]> {
        return new Promise<Array<Questionnaire>>((resolve, reject) => {
            this._questionnaireRepoModel.find(filters)
                .populate('questions')
                .then((result: any) => {
                    return resolve(result.map((item: any) => this._questionnaireEntityMapper.transform(item)))
                })
                .catch((err: any) => {
                    return reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async findOne(id: string): Promise<Questionnaire> {
        return new Promise<Questionnaire>((resolve, reject) => {
            this._questionnaireRepoModel.findOne({ _id: id })
                .populate('questions')
                .then((result: any) => {
                    if (!result) {
                        return reject(new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'questionário').replace('{1}', id)))
                    }

                    const questionnaire: any = this._questionnaireEntityMapper.transform(result)
                    return resolve(questionnaire)
                })
                .catch((err: any) => {
                    reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, err.message))
                })
        })
    }

    public async update(questionnaire: Questionnaire): Promise<Questionnaire> {
        const questionnaireUp = this._questionnaireEntityMapper.transform(questionnaire)

        return new Promise<Questionnaire>((resolve, reject) => {
            this._questionnaireRepoModel.findByIdAndUpdate(questionnaire.id, questionnaireUp)
                .then((result: any) => {
                    return resolve(this.findOne(result.id))
                })
                .catch((err: any) => reject(err))
        })
    }

    public async addQuestionToQuestionnaire(questionnaire_id: string, question: Question): Promise<Question> {
        const questionnaire: Questionnaire = await this.findOne(questionnaire_id)
        questionnaire.questions?.push(question)

        const questionnaireUp = this._questionnaireEntityMapper.transform(questionnaire)

        return new Promise<Question>((resolve, reject) => {
            this._questionnaireRepoModel.findByIdAndUpdate(questionnaire_id, questionnaireUp)
                .then((result: any) => {
                    return resolve(question)
                })
                .catch((err: any) => reject(err))
        })
    }

    public async delete(id: string): Promise<Questionnaire> {
        return new Promise<Questionnaire>((resolve, reject) => {
            this._questionnaireRepoModel.findOneAndDelete({ _id: id })
                .then((result: any) => {
                    return resolve(new Questionnaire())
                })
                .catch((err: any) => reject(err))
        })
    }

    public async deleteQuestion(question_id: string): Promise<Questionnaire> {
        return new Promise<Questionnaire>((resolve, reject) => {
            return this._questionnaireRepoModel.updateMany({ questions: { $in: question_id } },
                { $pullAll: { questions: [question_id] } },
                { multi: true }, () => resolve(new Questionnaire()))
        })
    }

    public async count(filters: object): Promise<number> {
        return this._questionnaireRepoModel.count()
    }

    public async checkExist(filters: object): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this._questionnaireRepoModel.findOne(filters)
                .then((result: any) => resolve(!!result))
                .catch((err: any) => reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR)))
        })
    }

    public async checkExistQuestion(questionnaire_id: string, question: Question): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.findOne(questionnaire_id)
                .then((result: any) => {
                    const questionnaire: Questionnaire = this._questionnaireEntityMapper.jsonToModel(result)

                    questionnaire.questions?.forEach(q => {
                        if (q.description === question.description) resolve(true)
                    })

                    resolve(false)
                })
                .catch((err: any) => reject(new RepositoryException(Messages.ERROR_MESSAGE.INTERNAL_SERVER_ERROR)))
        })
    }
}

export const questionnairesRepository: QuestionnaireRepository = new QuestionnaireRepository()