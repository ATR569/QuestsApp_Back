import { AnswerComment } from '@src/application/domain/model/answer.comment'
import Mongoose, { Schema } from 'mongoose'
import { AnswerCommentRepoModel } from './answer.comment.schema'
import { QuestionRepoModel } from './questions.schema'

interface IAnswerModel extends Mongoose.Document { 
    description?: string
    author?: string
    score?: number
    questionId?: string
    answerComments?: Array<string>
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
        questionId: {
            type: String,
            required: 'O Id da questão é obrigatório!'
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        answerComments: [{
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



// When delete a answer... all their comments will be deleted too
answerSchema.post('findOneAndDelete', function (doc: IAnswerModel) {
    const filters = this.getFilter()
    const questionId = doc.questionId
    if (doc){
        AnswerCommentRepoModel
            .deleteMany({ 
                _id: { $in: doc.answerComments} 
            })
            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
    //all their references will be deleted too
    if (doc){
        QuestionRepoModel
            .findByIdAndUpdate({_id: doc.questionId}, {$pull: { answers : doc._id}})

            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
    
})



export const AnswerRepoModel = Mongoose.model<IAnswerModel>('Answer', answerSchema)