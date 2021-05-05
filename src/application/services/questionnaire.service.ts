import { Question } from '../domain/model/question'
import { Questionnaire } from '../domain/model/questionnaire'
import { IService } from '../port/service.interface'
import { QuestionnaireValidator } from '@src/application/domain/validation/questionnaire.validator'
import { QuestionValidator } from '@src/application/domain/validation/question.validator'
import { ConflictException, NotFoundException } from '../domain/exception/exceptions';
import { questionnairesRepository } from '@src/infrastructure/repository/questionnaires.repository'
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { questionsRepository } from '@src/infrastructure/repository/questions.repository'
import { groupsRepository } from '@src/infrastructure/repository/groups.repository'

class QuestionnaireService implements IService<Questionnaire> {

    public async add(questionnaire: Questionnaire): Promise<Questionnaire> {
        try {
            QuestionnaireValidator.validate(questionnaire)

            if ((await questionnairesRepository.checkExist({ discipline: questionnaire.discipline }))) {
                throw new ConflictException(Messages.QUESTIONNAIRES.ALREADY_REGISTERED.replace('{0}', questionnaire.discipline))
            }

            if (!(await groupsRepository.checkExist({ _id: questionnaire.groupId })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'grupo').replace('{1}', questionnaire.groupId))

            return questionnairesRepository.create(questionnaire)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async addQuestion(questionnaire_id: string, question: Question): Promise<Question> {
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

            const newQuestion: Question = await questionsRepository.create(question)

            return questionnairesRepository.addQuestionToQuestionnaire(questionnaire_id, newQuestion)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object): Promise<Questionnaire[]> {
        return questionnairesRepository.find(filters)
    }

    public async getById(id: string): Promise<Questionnaire> {
        ObjectIdValidator.validate(id)

        return questionnairesRepository.findOne(id)
    }

    public async update(questionnaire: Questionnaire): Promise<Questionnaire> {
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

            return questionnairesRepository.update(questionnaire)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<Questionnaire> {
        ObjectIdValidator.validate(id)
        return questionnairesRepository.delete(id)
    }

    public async removeQuestion(questionnaire_id: string, question_id: string): Promise<Questionnaire> {
        ObjectIdValidator.validate(questionnaire_id)
        ObjectIdValidator.validate(question_id)

        if (!(await questionnairesRepository.checkExist({ _id: questionnaire_id })))
            throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'questionário').replace('{id}', questionnaire_id))

        return questionnairesRepository.deleteQuestion(question_id)
    }
}

export const questionnairesService = new QuestionnaireService()