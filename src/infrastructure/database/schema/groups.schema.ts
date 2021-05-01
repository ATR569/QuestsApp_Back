import Mongoose, { Schema } from 'mongoose'
import { QuestionnaireRepoModel } from './questionnaire.schema'

interface IGroupModel extends Mongoose.Document {
    name?: string,
    administrator?: string,
    members?: Array<string>,
    questionnires?: Array<string>
}

const groupSchema = new Schema(
    {
        name: {
            type: String,
            required: 'nome do grupo é obrigatório!'
        },
        administrator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        questionnaires: [{
            type: Schema.Types.ObjectId,
            ref: 'Questionnaire'
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
groupSchema.post('findOneAndDelete', function (doc: IGroupModel) {
    if (doc){
        QuestionnaireRepoModel
            .deleteMany({ 
                _id: { $in: doc.questionnires } 
            })
            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
})

export const GroupRepoModel = Mongoose.model<IGroupModel>('Group', groupSchema)