import { Answer } from '../domain/model/answer'
import { IService } from '@src/application/port/service.interface';
import { NotFoundException } from '../domain/exception/exceptions';
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';
import { answersRepository } from '@src/infrastructure/repository/answers.repository'


class AnswerService implements IService<Answer> {

    public async add(answer: Answer): Promise<Answer> {
        return Promise.reject(new Error('Method not implemented. '))
    }

    public async getAll(filters: object): Promise<Answer[]> {
        return Promise.reject(new Error('Method not implemented. '))
    }

    public async getById(answer_id: string): Promise<Answer> {
        ObjectIdValidator.validate(answer_id)

        return answersRepository.findOne(answer_id)
    }

    public async update(answer: Answer): Promise<Answer> {
        try {

            if (!(await answersRepository.checkExist({ _id: answer.id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'answer').replace('{id}', answer.id))

            return answersRepository.update(answer)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<Answer> {
        return answersRepository.delete(id)
    }

}

export const answerService = new AnswerService()