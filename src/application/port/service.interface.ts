export interface IService<T> {

    add(item: T, user_context: string): Promise<T>

    getAll(filters: object): Promise<Array<T>>

    getById(id: string, user_context: string): Promise<T>

    update(item: T, user_context: string): Promise<T>

    remove(id: string, user_context: string): Promise<T>
}