import Mongoose, { Schema } from 'mongoose'

interface IQuestionModel extends Mongoose.Document { }

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
            type: Schema.Types.ObjectId
            /*ref: 'Answer'*/
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

export const QuestionRepoModel = Mongoose.model<IQuestionModel>('Question', questionSchema)