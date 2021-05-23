import { Question } from '../domain/model/question'
import { Questionnaire } from '../domain/model/questionnaire'
import { IService } from '../port/service.interface'
import { QuestionnaireValidator } from '@src/application/domain/validation/questionnaire.validator'
import { QuestionValidator } from '@src/application/domain/validation/question.validator'
import { ConflictException, ForbiddenException, NotFoundException } from '../domain/exception/exceptions';
import { questionnairesRepository } from '@src/infrastructure/repository/questionnaires.repository'
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { questionsRepository } from '@src/infrastructure/repository/questions.repository'
import { groupsRepository } from '@src/infrastructure/repository/groups.repository'

class QuestionnaireService implements IService<Questionnaire> {

    public async add(questionnaire: Questionnaire, user_context: string): Promise<Questionnaire> {
        try {
            QuestionnaireValidator.validate(questionnaire)

            if ((await questionnairesRepository.checkExist({ discipline: questionnaire.discipline }))) {
                throw new ConflictException(Messages.QUESTIONNAIRES.ALREADY_REGISTERED.replace('{0}', questionnaire.discipline))
            }

            if (!(await groupsRepository.checkExist({ _id: questionnaire.groupId })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'grupo').replace('{1}', questionnaire.groupId))

            await this.isMemberOf(user_context, questionnaire.groupId!)
                .then(res => { if (!res) this.generateForbiddenExceptionMessage() })

            return questionnairesRepository.create(questionnaire)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async addQuestion(questionnaire_id: string, question: Question, user_context: string): Promise<Question> {
        try {
            ObjectIdValidator.validate(questionnaire_id)
            QuestionValidator.validateCreate(question)

            if (!(await questionnairesRepository.checkExist({ _id: questionnaire_id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'questionário').replace('{id}', questionnaire_id))

            if (question.creator !== undefined && question.creator.id !== undefined) {
                if (!(await usersRepository.checkExist({ _id: question.creator.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.QUESTIONS.CREATOR_ID_NOT_REGISTERED)
            }

            if ((await questionnairesRepository.checkExistQuestion(questionnaire_id, question))) {
                throw new ConflictException(Messages.QUESTIONNAIRES.ALREADY_REGISTERED_QUESTION
                    .replace('{0}', questionnaire_id).replace('{1}', question.description))
            }

            await this.checkForbidden(questionnaire_id, user_context)

            const newQuestion: Question = await questionsRepository.create(question)

            return questionnairesRepository.addQuestionToQuestionnaire(questionnaire_id, newQuestion)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: any, user_context: string): Promise<Questionnaire[]> {
        try {
            await this.isMemberOf(user_context, filters.groupId!)
                .then(res => { if (!res) this.generateForbiddenExceptionMessage() })

            return questionnairesRepository.find(filters)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(id: string, user_context: string): Promise<Questionnaire> {
        ObjectIdValidator.validate(id)

        return await questionnairesRepository.findOne(id)
            .then(async result => {
                await this.isMemberOf(user_context, result.groupId!)
                    .then(res => { if (!res) this.generateForbiddenExceptionMessage() })
                return result
            })
            .catch(err => { throw err })
    }

    public async update(questionnaire: Questionnaire, user_context: string): Promise<Questionnaire> {
        try {
            ObjectIdValidator.validate(questionnaire.id!)

            QuestionnaireValidator.validateUpdate(questionnaire)

            await questionnairesRepository.find({ discipline: questionnaire.discipline })
                .then(questionnaires => {
                    questionnaires.forEach(q => {
                        if (q.id !== questionnaire.id)
                            throw new ConflictException(Messages.QUESTIONNAIRES.ALREADY_REGISTERED.replace('{0}', questionnaire.discipline))
                    })
                })

            if (!(await questionnairesRepository.checkExist({ _id: questionnaire.id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'questionário').replace('{id}', questionnaire.id))

            await this.checkForbidden(questionnaire.id!, user_context)

            return questionnairesRepository.update(questionnaire)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string, user_context: string): Promise<Questionnaire> {
        try {
            ObjectIdValidator.validate(id)

            await this.checkForbidden(id, user_context)

            return questionnairesRepository.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async removeQuestion(questionnaire_id: string, question_id: string, user_context: string): Promise<Questionnaire> {
        ObjectIdValidator.validate(questionnaire_id)
        ObjectIdValidator.validate(question_id)

        if (!(await questionnairesRepository.checkExist({ _id: questionnaire_id })))
            throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'questionário').replace('{id}', questionnaire_id))

        await this.checkForbidden(questionnaire_id, user_context)

        return questionnairesRepository.deleteQuestion(question_id)
    }

    private async checkForbidden(questionnaire_id: string, user_context: string): Promise<void> {
        await questionnairesRepository.findOne(questionnaire_id)
            .then(async result => {
                await this.isMemberOf(user_context, result.groupId!)
                    .then(res => { if (!res) this.generateForbiddenExceptionMessage() })
            })
            .catch(err => { throw err })
    }

    private async isMemberOf(userId: string, groupId: string): Promise<boolean> {
        if (!(await groupsRepository.checkExist({ _id: groupId })))
            throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'grupo').replace('{1}', groupId))

        return groupsRepository.checkMember(groupId, userId)
    }

    private generateForbiddenExceptionMessage(): ForbiddenException {
        throw new ForbiddenException(Messages.ERROR_MESSAGE.FORBIDDEN, Messages.ERROR_MESSAGE.FORBIDDEN_DESC)
    }
}

export const questionnairesService = new QuestionnaireService()