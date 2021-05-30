import { InviteRepoModel } from '@src/infrastructure/database/schema/invite.schema'

export abstract class InvitesDBUtils {
    public static async saveInvite(invite: object): Promise<any> {
        return await InviteRepoModel.create(invite)
    }

    public static async removeAllInvites(): Promise<{}> {
        return await InviteRepoModel.deleteMany({})
    }
}