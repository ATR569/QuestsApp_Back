import { IService } from '../port/service.interface'
import { ConflictException, NotFoundException } from '../domain/exception/exceptions';
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { AnswerComment } from '../domain/model/answer.comment'
import { AnswerCommentValidator } from '@src/application/domain/validation/answerComment.validator'

class AnswerCommentService implements IService<AnswerComment>{
    public async add(answerComment: AnswerComment): Promise<AnswerComment> {
        // try {
        //     AnswerCommentValidator.validate(answerComment)

        //     if (answerComment.author !== undefined && answerComment.author.id !== undefined) {
        //         if (!(await usersRepository.checkExist({ _id: answerComment.author.id })))
        //             throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
        //                 Messages.ANSWERS_COMMENTS.AUTHOR_ID_NOT_REGISTERED)
        //     }

            

        // } catch (err) {
        //     return Promise.reject(err)
        // }

        throw new Error('Method not implemented.');
    }

    public async getAll(filters: object): Promise<AnswerComment[]> {
        throw new Error('Method not implemented.');
    }

    public async getById(id: string): Promise<AnswerComment> {
        throw new Error('Method not implemented.');
    }

    public async update(item: AnswerComment): Promise<AnswerComment> {
        throw new Error('Method not implemented.');
    }

    public async remove(id: string): Promise<AnswerComment> {
        throw new Error('Method not implemented.');
    }
}

export const answerCommentService = new AnswerCommentService()