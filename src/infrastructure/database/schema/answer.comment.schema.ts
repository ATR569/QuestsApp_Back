import Mongoose, { Schema } from 'mongoose'

interface IAnswerCommentModel extends Mongoose.Document { }

const answerCommentSchema = new Schema(
    {
        comment: {
            type: String,
            required: 'A descrição do comentário é obrigatória!'
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        answerId: {
            type: String,
            required: 'grupo é obrigatório'
        },
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