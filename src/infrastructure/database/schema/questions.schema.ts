import Mongoose, { Schema } from 'mongoose'
import { AnswerRepoModel } from './answer.schema'

interface IQuestionModel extends Mongoose.Document { 
    description?: string
    creator?: string
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

// When delete a group, all their questionnaires will be deleted too
questionSchema.post('findOneAndDelete', function (doc: IQuestionModel) {
    const filters = this.getFilter()
    if (doc){
        AnswerRepoModel
            .deleteMany({ 
                _id: { $in: doc.answers} 
            })
            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
})

export const QuestionRepoModel = Mongoose.model<IQuestionModel>('Question', questionSchema)