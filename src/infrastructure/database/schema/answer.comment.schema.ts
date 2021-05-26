import Mongoose, { Schema } from 'mongoose'
import { AnswerRepoModel } from './answer.schema'

interface IAnswerCommentModel extends Mongoose.Document {
    comment?: string
    author?: string
    answerId?: string
}

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
            required: 'O id da resposta é obrigatório'
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

answerCommentSchema.post('findOneAndDelete', function (doc: IAnswerCommentModel) {
    if (doc) {
        AnswerRepoModel
            .findByIdAndUpdate({ _id: doc.answerId }, { $pull: { answerComments: doc._id } })
            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
})

export const AnswerCommentRepoModel = Mongoose.model<IAnswerCommentModel>('AnswerComment', answerCommentSchema)