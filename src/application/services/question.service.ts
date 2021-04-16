import { IService } from '@src/application/port/service.interface';
import { Question } from '../domain/model/question';


export class QuestionService implements IService<Question> {

    public async add(question: Question): Promise<Question> {
        question.id = '507f1f77bcf86cd799439011'
        return Promise.resolve(question)
    }
    public async getAll(filters: object): Promise<Question[]> {
        const createdQuestion = {
            id: '507f1f77bcf86cd799439011',
            description: 'Q1',
            creator: 'Jardesson',
            answers: [
                { id: '507f1f77bcf86cd799439007', usuario: 'Jardesson', descricao: 'R1', likes: 1, visivel: true, listaDiscussao: ['coment1', 'coment2'] }
            ]
        }

        const questions: Array<Question> = new Array(
            new Question().fromJSON(createdQuestion)
        )

        return Promise.resolve(questions)
    }

    public async getById(id: string): Promise<Question> {
        const createdQuestion = {
            id: '507f1f77bcf86cd799439011',
            description: 'Q1',
            creator: 'Jardesson',
            answers: [
                { id: '507f1f77bcf86cd799439007', usuario: 'Jardesson', descricao: 'R1', likes: 1, visivel: true, listaDiscussao: ['coment1', 'coment2'] }
            ]
        }

        return Promise.resolve(new Question().fromJSON(createdQuestion))
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