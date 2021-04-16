import Mongoose, { Schema } from 'mongoose'

interface IQuestionnaireModel extends Mongoose.Document { }

const questionnaireSchema = new Schema(
    {
        discipline: {
            type: String,
            required: 'disciplina é obrigatória'
        },
        questions: [{
            type: Schema.Types.ObjectId,
            ref: 'Question'
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

export const QuestionnaireRepoModel = Mongoose.model<IQuestionnaireModel>('Questionnaire', questionnaireSchema)