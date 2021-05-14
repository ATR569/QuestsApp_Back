import { InviteStatus } from '@src/application/domain/model/invite'
import Mongoose, { Schema } from 'mongoose'
import { GroupRepoModel } from './groups.schema'
interface IInviteModel extends Mongoose.Document {
    group?: string
    user?: string
    status?: string
}

const inviteSchema = new Schema(
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

inviteSchema.post('findOneAndUpdate', function (doc: IInviteModel) {
    const updatedStatus = this.getUpdate()!['$set']!.status

    if (updatedStatus === InviteStatus.ACCEPTED) {
        GroupRepoModel.findByIdAndUpdate(doc.group, { $push: { members: doc.user } })
            .then(res => Promise.resolve(res))
            .catch(err => Promise.reject(err))
    }
})

export const InviteRepoModel = Mongoose.model<IInviteModel>('Invite', inviteSchema)