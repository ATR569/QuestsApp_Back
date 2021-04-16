import Mongoose, { Schema } from 'mongoose'

interface IGroupModel extends Mongoose.Document { }

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

export const GroupRepoModel = Mongoose.model<IGroupModel>('Group', groupSchema)