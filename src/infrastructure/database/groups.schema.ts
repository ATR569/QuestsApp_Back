import Mongoose, { Schema } from 'mongoose'

interface IGroupsModel extends Mongoose.Document { }

const groupsSchema = new Schema({
    name: {
        type: String,
        required: 'nome do grupo é obrigatório!'
    },
    administrator_id: {
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
})

