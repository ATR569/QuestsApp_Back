import { IService } from '../port/service.interface'
import { NotFoundException } from '../domain/exception/exceptions';
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { answersRepository } from '@src/infrastructure/repository/answers.repository'
import { AnswerComment } from '../domain/model/answer.comment'
import { AnswerCommentValidator } from '@src/application/domain/validation/answerComment.validator'
import { answerCommentRepository } from '@src/infrastructure/repository/answerComment.repository'

class AnswerCommentService implements IService<AnswerComment>{
    public async add(answerComment: AnswerComment): Promise<AnswerComment> {
        try {
            AnswerCommentValidator.validate(answerComment)

            if (!(await answersRepository.checkExist({ _id: answerComment.answerId }))) {
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'answer').replace('{1}', answerComment.answerId))
            }

            if (answerComment.author !== undefined && answerComment.author.id !== undefined) {
                if (!(await usersRepository.checkExist({ _id: answerComment.author.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.ANSWERS_COMMENTS.AUTHOR_ID_NOT_REGISTERED)
            }

            return answerCommentRepository.create(answerComment)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object): Promise<AnswerComment[]> {
        return answerCommentRepository.find(filters)
    }

    public async getById(id: string): Promise<AnswerComment> {
        ObjectIdValidator.validate(id)

        return answerCommentRepository.findOne(id)
    }

    public async update(answerComment: AnswerComment): Promise<AnswerComment> {
        try {
            ObjectIdValidator.validate(answerComment.id!)

            AnswerCommentValidator.validateUpdate(answerComment)

            if (!(await answerCommentRepository.checkExist({ _id: answerComment.id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{0}', 'questionário').replace('{1}', answerComment.id))

            return answerCommentRepository.update(answerComment)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<AnswerComment> {
        ObjectIdValidator.validate(id)
        return answerCommentRepository.delete(id)
    }
}

export const answerCommentService = new AnswerCommentService()