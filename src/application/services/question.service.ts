import { Question } from '../domain/model/question';
import { IService } from '@src/application/port/service.interface';
import { questionsRepository } from '@src/infrastructure/repository/questions.repository'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { QuestionValidator } from '../domain/validation/question.validator';
import { ConflictException, NotFoundException } from '../domain/exception/exceptions';
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';
import { Answer } from '../domain/model/answer';
import { AnswerValidator } from '../domain/validation/answer.validator';
import { answersRepository } from '@src/infrastructure/repository/answers.repository';


class QuestionService implements IService<Question> {

    public async add(question: Question): Promise<Question> {
        try {
            QuestionValidator.validateCreate(question)

             
            //  Check if the user is registered
            if (question.creator !== undefined && question.creator.id !== undefined) {
                if (!(await usersRepository.checkExist({ _id: question.creator.id })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.QUESTIONS.CREATOR_ID_NOT_REGISTERED)
            }            
            //Creates the question
            return questionsRepository.create(question)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(filters: object): Promise<Question[]> {
        try {
            return questionsRepository.find(filters)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async createAnswer( answer: Answer): Promise<Answer> {
        try {
            AnswerValidator.validateCreate(answer)
            
            
            //Creates the answer
            const ans = answersRepository.create(answer);
            
                    
            
            return ans
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(question_id: string): Promise<Question> {
        ObjectIdValidator.validate(question_id)

        return questionsRepository.findOne(question_id)
    }

    public async update(question: Question): Promise<Question> {
        try {

            if (!(await questionsRepository.checkExist({ _id: question.id })))
                throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                    Messages.ERROR_MESSAGE.DESC_NOT_FOUND.replace('{recurso}', 'question').replace('{id}', question.id))

            return questionsRepository.update(question)
        } catch (err) {
            return Promise.reject(err)
        }
    
    }
    
    public async remove(id: string): Promise<Question> {
        return questionsRepository.delete(id)
    }

    public async getAllAnswers(question_id: string): Promise<Array<Answer>> {
        ObjectIdValidator.validate(question_id)

        return questionsRepository.getAnswers(question_id)
    }
}

export const questionService = new QuestionService()