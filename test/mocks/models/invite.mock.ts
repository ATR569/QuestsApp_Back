import { Invite, InviteStatus } from '@src/application/domain/model/invite'
import { ObjectID } from 'bson'
import { GroupMock } from './group.mock'
import { UserMock } from './user.mock'

export class InviteMock extends Invite {
    constructor() {
        super()
        this.generateInvite()        
    }

    private generateInvite(): void {
        this.id = new ObjectID().toHexString()
        this.status = InviteStatus.PENDING
        this.group = new GroupMock()
        this.user = new UserMock()
    }

    public toJSON(): object {
        return {
            group: {
                id: this.group?.id
            },
            user: {
                id: this.user?.id
            }
        }
    }
}