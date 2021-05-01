import { Group } from '@src/application/domain/model/group'
import { ObjectID } from 'bson'

export class GroupMock extends Group {
    constructor() {
        super()
        this.generateGroup()        
    }

    private generateGroup(): void {
        this.id = new ObjectID().toHexString()
        this.name = 'Group mock'
        this.questionnaires = []
    }

    public toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            administrator: this.administrator,
            questionnaires: this.questionnaires,
            members: this.members
        }
    }
}