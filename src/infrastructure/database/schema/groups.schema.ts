import Mongoose, { Schema } from 'mongoose'
import { QuestionnaireRepoModel } from './questionnaire.schema'

interface IGroupModel extends Mongoose.Document {
    name?: string
    administrator?: string
    members?: Array<string>
    questionnaires?: Array<string>
    members_count?: number
    questionnaires_count?: number
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
        }],
        members_count: {
            type: Schema.Types.Number
        },
        questionnaires_count: {
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

// When delete a group, all their questionnaires will be deleted too
groupSchema.post('findOneAndDelete', function (doc: IGroupModel) {
    if (doc){
        QuestionnaireRepoModel
            .deleteMany({ 
                _id: { $in: doc.questionnaires } 
            })
            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
})

groupSchema.post('find', function(doc: Array<IGroupModel>) {
    doc.forEach(item => {
        if(item.members) {
            item.members_count = item.members.length
            item.members = undefined
        }
        
        if(item.questionnaires) {
            item.questionnaires_count = item.questionnaires.length
            item.questionnaires = undefined
        }
    })
})

export const GroupRepoModel = Mongoose.model<IGroupModel>('Group', groupSchema)