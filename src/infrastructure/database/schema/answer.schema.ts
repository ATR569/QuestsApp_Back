import Mongoose, { Schema } from 'mongoose'

interface IAnswerModel extends Mongoose.Document { }

const answerSchema = new Schema(
    {
        description: {
            type: String,
            required: 'A descrição da resposta é obrigatória!'
        },
        score: {
            type: Number
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'AnswerComment'
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

export const AnswerRepoModel = Mongoose.model<IAnswerModel>('Answer', answerSchema)