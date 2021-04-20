import { Question } from '../domain/model/question';
import { IService } from '@src/application/port/service.interface';
import { questionsRepository } from '@src/infrastructure/repository/questions.repository'
import { usersRepository } from '@src/infrastructure/repository/user.repository'
import { QuestionValidator } from '../domain/validation/question.validator';
import { ConflictException, NotFoundException } from '../domain/exception/exceptions';
import { Messages } from '@src/utils/messages';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';


export class QuestionService implements IService<Question> {

    public async add(question: Question): Promise<Question> {
        try {
            QuestionValidator.validateCreate(question)

            if ((await questionsRepository.checkExist({description: question.description })))
                throw new ConflictException(Messages.QUESTIONS.ALREADY_REGISTERED.replace('{0}', question.description))
            
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

    public async getById(question_id: string): Promise<Question> {
        ObjectIdValidator.validate(question_id)

        return questionsRepository.findOne(question_id)
    }

    public async update(item: Question): Promise<Question> {
        return Promise.reject(new Error('Method not implemented. Update questionnaire by id'))
    }
    
    public async remove(id: string): Promise<Question> {
        return Promise.resolve(new Question())
    }

    public async getAllAnswers(group_id: string): Promise<Array<object>> {
        return Promise.reject(new Error('Method not implemented. Get all answers from questions'))
    }
}

export const questionService = new QuestionService()