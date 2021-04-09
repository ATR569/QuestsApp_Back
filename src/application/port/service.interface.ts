export interface IService<T> {

    add(item: T): Promise<T>

    getAll(filters: object): Promise<Array<T>>

    getById(id: string): Promise<T>

    update(item: T): Promise<T>

    remove(id: string): Promise<T>
    
}