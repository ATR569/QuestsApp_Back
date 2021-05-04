import { GroupRepoModel } from '@src/infrastructure/database/schema/groups.schema'

export abstract class GroupsDBUtils {
    public static async saveGroup(group: object): Promise<any> {
        return await GroupRepoModel.create(group)
    }

    public static async removeAllGroups(): Promise<{}> {
        return await GroupRepoModel.deleteMany({})
    }

    public static async addMemberToGroup(member: any, group: any): Promise<any> {
        const updateQuery = {$push: {members: member.id}}
        return await GroupRepoModel.findOneAndUpdate({_id: group.id}, updateQuery)
    }
}