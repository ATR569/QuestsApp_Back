import Mongoose, { Schema } from 'mongoose'

interface IAnswerCommentModel extends Mongoose.Document { }

const answerCommentSchema = new Schema(
    {
        description: {
            type: String,
            required: 'A descrição do comentário é obrigatória!'
        },
        score: {
            type: Number
        }
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

export const AnswerCommentRepoModel = Mongoose.model<IAnswerCommentModel>('AnswerComment', answerCommentSchema)