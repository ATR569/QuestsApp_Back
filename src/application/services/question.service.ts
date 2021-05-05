import { IService } from '@src/application/port/service.interface';
import { questionnairesRepository } from '@src/infrastructure/repository/questionnaires.repository';
import { questionsRepository } from '@src/infrastructure/repository/questions.repository';
import { usersRepository } from '@src/infrastructure/repository/user.repository';
import { Messages } from '@src/utils/messages';
import { NotFoundException } from '../domain/exception/exceptions';
import { Answer } from '../domain/model/answer';
import { Question } from '../domain/model/question';
import { ObjectIdValidator } from '../domain/validation/object.id.validator';
import { QuestionValidator } from '../domain/validation/question.validator';


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
            //  Check if the question is registered
            if (question.questionnaireID !== undefined && question.questionnaireID !== undefined) {
                if (!(await questionnairesRepository.checkExist({ _id: question.questionnaireID })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.QUESTIONS.QUESTIONNAIRE_ID_NOT_REGISTERED)
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


    public async getById(questionID: string): Promise<Question> {
        

        return questionsRepository.findOne(questionID)
    }

    public async update(question: Question): Promise<Question> {
        try {
            QuestionValidator.validateUpdate(question)


            //  Check if the question is registered
            if (question.questionnaireID !== undefined && question.questionnaireID !== undefined) {
                if (!(await questionnairesRepository.checkExist({ _id: question.questionnaireID })))
                    throw new NotFoundException(Messages.ERROR_MESSAGE.MSG_NOT_FOUND,
                        Messages.QUESTIONS.QUESTIONNAIRE_ID_NOT_REGISTERED)
            }   

            return questionsRepository.update(question)
        } catch (err) {
            return Promise.reject(err)
        }
    
    }
    
    public async remove(id: string): Promise<Question> {
        ObjectIdValidator.validate(id)
        return questionsRepository.delete(id)
    }

    public async getAllAnswers(questionID: string): Promise<Array<Answer>> {
        ObjectIdValidator.validate(questionID)

        return questionsRepository.getAnswers(questionID)
    }
}

export const questionService = new QuestionService()