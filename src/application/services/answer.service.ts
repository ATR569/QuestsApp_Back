import { IService } from '@src/application/port/service.interface';
import { answersRepository } from '@src/infrastructure/repository/answers.repository';
import { questionsRepository } from '@src/infrastructure/repository/questions.repository';
import { usersRepository } from '@src/infrastructure/repository/user.repository';
import { Messages } from '@src/utils/messages';
import { ForbiddenException, NotFoundException } from '../domain/exception/exceptions';
import { Answer } from '../domain/model/answer';
import { AnswerValidator } from '../domain/validation/answer.validator';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';
import { questionService } from './question.service'

class AnswerService implements IService<Answer> {

    public async add(answer: Answer, user_context: string): Promise<Answer> {
        try {
            AnswerValidator.validateCreate(answer)

            //  Check if the user is registered
            if (answer.author !== undefined && answer.author.id !== undefined) {
                if (!(await usersRepository.checkExist({ _id: answer.author.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.ANSWERS.AUTHOR_ID_NOT_REGISTERED)
            }
            //  Check if the question is registered
            if (answer.questionId !== undefined && answer.questionId !== undefined) {
                if (!(await questionsRepository.checkExist({ _id: answer.questionId })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.ANSWERS.QUESTION_ID_NOT_REGISTERED)
            }

            //  Check Forbidden
            if (answer.author!.id !== user_context)
                throw new ForbiddenException(Messages.ERROR_MESSAGE.FORBIDDEN, Messages.ERROR_MESSAGE.FORBIDDEN_DESC)

            await questionService.checkForbidden(answer.questionId!, user_context)

            //Creates the answer  
            return answersRepository.create(answer);
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object): Promise<Answer[]> {
        try {
            return answersRepository.find(filters)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(answerId: string, user_context: string): Promise<Answer> {
        ObjectIdValidator.validate(answerId)

        return answersRepository.findOne(answerId)
            .then(async result => {
                await questionService.checkForbidden(result.questionId!, user_context)
                return result
            })
            .catch(err => {
                throw err
            })
    }

    public async updateLike(answer: Answer, user_context: string): Promise<Answer> {
        try {
            ObjectIdValidator.validate(answer.id!)

            if (!(await answersRepository.checkExist({ _id: answer.id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'answer').replace('{1}', answer.id))

            await this.checkForbidden(answer.id!, user_context)

            return answersRepository.updateLike(answer)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(answer: Answer, user_context: string): Promise<Answer> {
        try {
            ObjectIdValidator.validate(answer.id!)

            if (!(await answersRepository.checkExist({ _id: answer.id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'answer').replace('{1}', answer.id))

            await this.checkForbidden(answer.id!, user_context)

            return answersRepository.update(answer)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string, user_context: string): Promise<Answer> {
        ObjectIdValidator.validate(id)

        await this.checkForbidden(id, user_context)

        return answersRepository.delete(id)
    }

    public async checkForbidden(answer_id: string, user_context: string): Promise<void> {
        const result = await answersRepository.findOne(answer_id)
        await questionService.checkForbidden(result.questionId!, user_context)
    }
}

export const answerService = new AnswerService()