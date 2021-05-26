import { IService } from '@src/application/port/service.interface'
import { groupsRepository } from '@src/infrastructure/repository/groups.repository'
import { questionnairesRepository } from '@src/infrastructure/repository/questionnaires.repository'
import { questionsRepository } from '@src/infrastructure/repository/questions.repository'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { Messages } from '@src/utils/messages'
import { ForbiddenException, NotFoundException } from '../domain/exception/exceptions'
import { Answer } from '../domain/model/answer'
import { Question } from '../domain/model/question'
import { ObjectIdValidator } from '../domain/validation/object.id.validator'
import { QuestionValidator } from '../domain/validation/question.validator'
import { questionnairesService } from './questionnaire.service'

class QuestionService implements IService<Question> {

    public async add(question: Question, user_context: string): Promise<Question> {
        try {
            QuestionValidator.validateCreate(question)

            //  Check if the user is registered
            if (question.creator !== undefined && question.creator!.id !== undefined) {
                if (!(await usersRepository.checkExist({ _id: question.creator!.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.QUESTIONS.CREATOR_ID_NOT_REGISTERED)
            }

            //  Check if the question is registered
            if (question.questionnaireId !== undefined && question.questionnaireId === '') {
                if (!(await questionnairesRepository.checkExist({ _id: question.questionnaireId })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.QUESTIONS.QUESTIONNAIRE_ID_NOT_REGISTERED)
            }

            //  Check Forbidden
            if (question.creator!.id !== user_context)
                throw new ForbiddenException(Messages.ERROR_MESSAGE.FORBIDDEN, Messages.ERROR_MESSAGE.FORBIDDEN_DESC)

            await questionnairesService.checkForbidden(question.questionnaireId!, user_context)

            //Creates the question
            return questionsRepository.create(question)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object, user_context: string): Promise<Question[]> {
        try {
            return questionsRepository.find(filters)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(questionId: string, user_context: string): Promise<Question> {
        ObjectIdValidator.validate(questionId)

        return questionsRepository.findOne(questionId)
            .then(async result => {
                await questionnairesService.checkForbidden(result.questionnaireId!, user_context)
                return result
            })
    }

    public async update(question: Question, user_context: string): Promise<Question> {
        try {
            QuestionValidator.validateUpdate(question)

            //  Check if the question is registered
            if (question.questionnaireId !== undefined && question.questionnaireId === '') {
                if (!(await questionnairesRepository.checkExist({ _id: question.questionnaireId })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.QUESTIONS.QUESTIONNAIRE_ID_NOT_REGISTERED)
            }

            await this.checkForbidden(question.id!, user_context)

            return questionsRepository.update(question)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string, user_context: string): Promise<Question> {
        ObjectIdValidator.validate(id)

        await this.checkForbidden(id, user_context)

        return questionsRepository.delete(id)
    }

    public async getAllAnswers(questionId: string): Promise<Array<Answer>> {
        ObjectIdValidator.validate(questionId)

        return questionsRepository.getAnswers(questionId)
    }

    public async checkForbidden(question_id: string, user_context: string): Promise<void> {
        const result = await questionsRepository.findOne(question_id)
        await questionnairesService.checkForbidden(result.questionnaireId!, user_context)
    }
}

export const questionService = new QuestionService()
