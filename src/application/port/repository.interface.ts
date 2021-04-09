export interface IRepository<T> {

    create(item: T): Promise<T>

    find(filters: object): Promise<Array<T>>

    findOne(id: string): Promise<T>

    update(item: T): Promise<T>

    delete(id: string): Promise<T>
    
    count(filters: object): Promise<number>

}