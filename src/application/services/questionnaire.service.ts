import { Question } from '../domain/model/question'
import { Questionnaire } from '../domain/model/questionnaire'
import { IService } from '../port/service.interface'

class QuestionnaireService implements IService<Questionnaire> {

    public async add(questionnaire: Questionnaire): Promise<Questionnaire> {
        questionnaire.id = '507f1f77bcf86cd799439011'
        return Promise.resolve(questionnaire)
    }

    public async addQuestion(questionnaire_id: string, question: Question): Promise<Question> {
        question.id = '507f1f77bcf86cd799439011'
        return Promise.resolve(question)
    }

    public async getAll(filters: object): Promise<Questionnaire[]> {
        const createdQuestionnaire = {
            id: '507f1f77bcf86cd799439011',
            discipline: 'software educacional',
            questions: [
                { id: '507f1f77bcf86cd799439007', description: 'Q1', creator: 'thairam', answers: ['R1', 'R2'] }
            ]
        }

        const questionnaires: Array<Questionnaire> = new Array(
            new Questionnaire().fromJSON(createdQuestionnaire)
        )

        return Promise.resolve(questionnaires)
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
        const createdQuestionnaire = {
            id: '507f1f77bcf86cd799439011',
            discipline: 'software educacional',
            questions: [
                { id: '507f1f77bcf86cd799439007', description: 'Q2', creator: 'thairam', answers: ['R1'] }
            ]
        }

        return Promise.resolve(new Questionnaire().fromJSON(createdQuestionnaire))
    }

    public async update(item: Questionnaire): Promise<Questionnaire> {
        return Promise.reject(new Error('Method not implemented. Update questionnaire by id'))
    }

    public async remove(id: string): Promise<Questionnaire> {
        return Promise.resolve(new Questionnaire())
    }
}

export const questionnairesService = new QuestionnaireService()