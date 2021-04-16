import { Question } from '../domain/model/question'
import { Questionnaire } from '../domain/model/questionnaire'
import { IService } from '../port/service.interface'
import { QuestionnaireValidator } from '@src/application/domain/validation/questionnaire.validator'
import { questionnairesRepository } from '@src/infrastructure/repository/questionnaires.repository'

class QuestionnaireService implements IService<Questionnaire> {

    public async add(questionnaire: Questionnaire): Promise<Questionnaire> {
        QuestionnaireValidator.validate(questionnaire)
        return questionnairesRepository.create(questionnaire)
    }

    public async addQuestion(questionnaire_id: string, question: Question): Promise<Question> {
        question.id = '507f1f77bcf86cd799439011'
        return Promise.resolve(question)
    }

    public async getAll(filters: object): Promise<Questionnaire[]> {
        return questionnairesRepository.find(filters)
    }

    public async getAllQuestionsFromQuestionnaire(questionnaire_id: string): Promise<Question[]> {
        const createdQuestions = {
            id: '507f1f77bcf86cd799439007', description: 'Q1', creator: 'thairam', answers: ['R1', 'R2']
        }

        const questions: Array<Question> = new Array(
            new Question().fromJSON(createdQuestions)
        )

        return Promise.resolve(questions)
    }

    public async getById(id: string): Promise<Questionnaire> {
        return questionnairesRepository.findOne(id)
    }

    public async update(questionnaire: Questionnaire): Promise<Questionnaire> {
        questionnaire.questions = undefined
        QuestionnaireValidator.validate(questionnaire)
        return questionnairesRepository.update(questionnaire)
    }

    public async remove(id: string): Promise<Questionnaire> {
        return questionnairesRepository.delete(id)
    }
}

export const questionnairesService = new QuestionnaireService()