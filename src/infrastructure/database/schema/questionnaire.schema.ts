import Mongoose, { Schema } from 'mongoose'
import { QuestionRepoModel } from './questions.schema'

interface IQuestionnaireModel extends Mongoose.Document {
    discipline?: string,
    groupId?: string,
    questions?: Array<string>,
    questions_count?: number
}

const questionnaireSchema = new Schema(
    {
        discipline: {
            type: String,
            required: 'disciplina é obrigatória'
        },
        groupId: {
            type: String,
            required: 'grupo é obrigatório'
        },
        questions: [{
            type: Schema.Types.ObjectId,
            ref: 'Question'
        }],
        questions_count: {
            type: Schema.Types.Number
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

questionnaireSchema.post('findOneAndDelete', function (doc: IQuestionnaireModel) {
    const filters = this.getFilter()
    if (doc) {
        QuestionRepoModel
            .deleteMany({
                _id: { $in: doc.questions }
            })
            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
})

questionnaireSchema.post('find', function (doc: Array<IQuestionnaireModel>) {
    doc.forEach(item => {
        if (item.questions) {
            item.questions_count = item.questions.length
            item.questions = undefined
        }
    })
})

export const QuestionnaireRepoModel = Mongoose.model<IQuestionnaireModel>('Questionnaire', questionnaireSchema)