import { IService } from '@src/application/port/service.interface';
import { answersRepository } from '@src/infrastructure/repository/answers.repository';
import { questionsRepository } from '@src/infrastructure/repository/questions.repository';
import { usersRepository } from '@src/infrastructure/repository/user.repository';
import { Messages } from '@src/utils/messages';
import { NotFoundException } from '../domain/exception/exceptions';
import { Answer } from '../domain/model/answer';
import { AnswerValidator } from '../domain/validation/answer.validator';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';


class AnswerService implements IService<Answer> {

    public async add(answer: Answer): Promise<Answer> {
        try {
            AnswerValidator.validateCreate(answer)
            
            //  Check if the user is registered
            if (answer.creator !== undefined && answer.creator.id !== undefined) {
                if (!(await usersRepository.checkExist({ _id: answer.creator.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.ANSWERS.CREATOR_ID_NOT_REGISTERED)
            }
            //  Check if the question is registered
            if (answer.questionID !== undefined && answer.questionID !== undefined) {
                if (!(await questionsRepository.checkExist({ _id: answer.questionID })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.ANSWERS.QUESTION_ID_NOT_REGISTERED)
            }        

            
            //Creates the answer  
            return answersRepository.create(answer);
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object): Promise<Answer[]> {
        return Promise.reject(new Error('Method not implemented. '))
    }

    public async getById(answerID: string): Promise<Answer> {
        ObjectIdValidator.validate(answerID)

        return answersRepository.findOne(answerID)
    }

    public async updateLike(answer: Answer): Promise<Answer> {
        try {
            ObjectIdValidator.validate(answer.id!)

            if (!(await answersRepository.checkExist({ _id: answer.id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'answer').replace('{id}', answer.id))

            return answersRepository.updateLike(answer)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(answer: Answer): Promise<Answer> {
        try {
            ObjectIdValidator.validate(answer.id!)

            if (!(await answersRepository.checkExist({ _id: answer.id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'answer').replace('{id}', answer.id))

            return answersRepository.update(answer)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<Answer> {
        ObjectIdValidator.validate(id)
        return answersRepository.delete(id)
    }

}

export const answerService = new AnswerService()