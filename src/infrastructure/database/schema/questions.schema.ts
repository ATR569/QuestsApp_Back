import Mongoose, { Schema } from 'mongoose'
import { AnswerRepoModel } from './answer.schema'
import { QuestionnaireRepoModel } from './questionnaire.schema'

interface IQuestionModel extends Mongoose.Document { 
    description?: string
    creator?: string
    questionnaireID?: string
    answers?: Array<string>

}

const questionSchema = new Schema(
    {
        description: {
            type: String,
            required: 'A descrição da pergunta é obrigatória!'
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        questionnaireID: {
            type: String,
            required: 'O Id do questionário é obrigatório!'
        },
        answers: [{
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }]
    },
    {
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
                return ret
            }
        }
    }
)

// When delete a question
questionSchema.post('findOneAndDelete', function (doc: IQuestionModel) {
    const filters = this.getFilter()
    //all their answers will be deleted too
    if (doc){
        AnswerRepoModel
            .deleteMany({ 
                _id: { $in: doc.answers} 
            })

            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
    //all their references will be deleted too
    if (doc){
        QuestionnaireRepoModel
            .deleteOne({ 
                _questions: { $in: doc.questionnaireID} 
            })

            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
})

export const QuestionRepoModel = Mongoose.model<IQuestionModel>('Question', questionSchema)