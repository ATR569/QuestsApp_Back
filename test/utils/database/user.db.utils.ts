import { UserRepoModel } from '@src/infrastructure/database/schema/user.schema'

export abstract class UsersDBUtils {
    public static async saveUser(user: object): Promise<any> {
        return await UserRepoModel.create(user)
    }

    public static async removeAllUsers(): Promise<{}> {
        return await UserRepoModel.deleteMany({})
    }
}