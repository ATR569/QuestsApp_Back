import { Questionnaire } from '@src/application/domain/model/questionnaire'
import { IRepository } from '@src/application/port/repository.interface'
import { QuestionnaireEntityMapper } from '../entity/questionnaire.entity'
import { QuestionnaireRepoModel } from '../database/schema/questionnaire.schema'
import { NotFoundException } from '@src/application/domain/exception/exceptions'
import { Messages } from '@src/utils/messages'

class QuestionnaireRepository implements IRepository<Questionnaire> {
    constructor(
        private readonly _questionnaireEntityMapper: QuestionnaireEntityMapper = new QuestionnaireEntityMapper(),
        private readonly _questionnaireRepoModel: any = QuestionnaireRepoModel
    ) { }

    public async create(questionnaire: Questionnaire): Promise<Questionnaire> {
        const newQuestionnaire = this._questionnaireEntityMapper.transform(questionnaire)

        return new Promise<Questionnaire>((resolve, reject) => {
            this._questionnaireRepoModel.create(newQuestionnaire)
                .then((result: any) => {
                    return resolve(questionnaire)
                }).catch((err: any) => reject(err))
        })
    }

    public async find(filters: object): Promise<Questionnaire[]> {
        return this._questionnaireRepoModel.find(filters)
    }

    public async findOne(id: string): Promise<Questionnaire> {
        return this._questionnaireRepoModel.findOne({ _id: id })
    }

    public async update(questionnaire: Questionnaire): Promise<Questionnaire> {
        const questionnaireUp = this._questionnaireEntityMapper.transform(questionnaire)

        return new Promise<Questionnaire>((resolve, reject) => {
            this._questionnaireRepoModel.findOneAndUpdate({ _id: questionnaireUp.id }, questionnaireUp, { new: true })
                .then((result: any) => {
                    if (!result)
                        return reject(new NotFoundException(
                            Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                            Messages.ERROR_MESSAGE.DESC_NOT_FOUND
                                .replace('{recurso}', 'questionário')
                                .replace('{id}', questionnaireUp.id))
                        )
                    return resolve(questionnaire)
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

    public async count(filters: object): Promise<number> {
        return this._questionnaireRepoModel.count()
    }
}

export const questionnairesRepository: QuestionnaireRepository = new QuestionnaireRepository()