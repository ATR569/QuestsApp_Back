import { Questionnaire } from '../domain/model/Questionnaire'
import { IService } from '../port/service.interface'

class QuestionnaireService implements IService<Questionnaire> {

    public async add(questionnaire: Questionnaire): Promise<Questionnaire> {
        questionnaire.id = '507f1f77bcf86cd799439011'
        return Promise.resolve(questionnaire)
    }

    public async getAll(filters: object): Promise<Questionnaire[]> {
        const createdQuestionnaire = {
            id: '507f1f77bcf86cd799439011',
            disciplina: 'software educacional',
            questions: [
                { id: '507f1f77bcf86cd799439007', descricao: 'Q1', criador: 'thairam', respostas: ['R1', 'R2'] }
            ]
        }

        const questionnaires: Array<Questionnaire> = new Array(
            new Questionnaire().fromJSON(createdQuestionnaire)
        )

        return Promise.resolve(questionnaires)
    }

    public async getById(id: string): Promise<Questionnaire> {
        const createdQuestionnaire = {
            id: '507f1f77bcf86cd799439011',
            disciplina: 'software educacional',
            questions: [
                { id: '507f1f77bcf86cd799439007', descricao: 'Q2', criador: 'thairam', respostas: ['R1'] }
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

    // public async addQuestion(question: Question): Promise<Question> {
    // TODO
    //     return Promise.reject(new Error('Method not implemented. Update questionnaire by id'))
    // }

    // public async getAllQuestionsFromQuestionnaire(): Promise<Question[]> {
    // TODO
    //     const createdQuestions = {
    //         id: '507f1f77bcf86cd799439007', descricao: 'Q1', criador: 'thairam', respostas: ['R1', 'R2']
    //     }

    //     const questions: Array<Question> = new Array(
    //         new Question().fromJSON(createdQuestions)
    //     )

    //     return Promise.resolve(questions)
    // }
}

export const questionnairesService = new QuestionnaireService()