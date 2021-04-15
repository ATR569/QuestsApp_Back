import Mongoose, { Schema } from 'mongoose'

interface IUserModel extends Mongoose.Document { }

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: 'nome do usuário é obrigatório!'
        },
        email: {
            type: String,
            required: 'email do usuário é obrigatório!'
        },
        password: {
            type: String,
            required: 'senha do usuário é obrigatório!'
        },
        institution: {
            type: String,
            required: 'instituição do usuário é obrigatório!'
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

export const UserRepoModel = Mongoose.model<IUserModel>('User', userSchema)