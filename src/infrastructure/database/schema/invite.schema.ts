import Mongoose, { Schema } from 'mongoose'

interface IInviteModel extends Mongoose.Document {
    group?: string
    user?: string
    status?: string
}

const groupSchema = new Schema(
    {
        group: {
            type: Schema.Types.ObjectId,
            required: 'grupo é obrigatório!',
            ref: 'Group'
        },
        user: {
            type: Schema.Types.ObjectId,
            required: 'usuário é obrigatório!',
            ref: 'User'
        },
        status: {
            type: Schema.Types.String
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

export const InviteRepoModel = Mongoose.model<IInviteModel>('Invite', groupSchema)