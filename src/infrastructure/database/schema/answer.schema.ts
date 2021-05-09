import { AnswerComment } from '@src/application/domain/model/answer.comment'
import Mongoose, { Schema } from 'mongoose'
import { AnswerCommentRepoModel } from './answer.comment.schema'
import { QuestionRepoModel } from './questions.schema'

interface IAnswerModel extends Mongoose.Document { 
    description?: string
    score?: number
    comments?: Array<string>
    question_id?: string
}

const answerSchema = new Schema(
    {
        description: {
            type: String,
            required: 'A descrição da resposta é obrigatória!'
        },
        score: {
            type: Schema.Types.Number
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'AnswerComment'
        }],

        
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

// When delete a answer, all their references will be deleted too
answerSchema.post('findOneAndDelete', function (doc: IAnswerModel) {
    const filters = this.getFilter()
    if (doc){
        AnswerCommentRepoModel
            .deleteMany({ 
                _id: { $in: doc.comments} 
            })
            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
})


export const AnswerRepoModel = Mongoose.model<IAnswerModel>('Answer', answerSchema)