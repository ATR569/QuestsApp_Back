  
/**
 * Generic Entity
 * 
 * @abstract
 */
 export abstract class Entity {
    private _id?: string

    get id(): string | undefined {
        return this._id
    }

    set id(id: string | undefined) {
        this._id = id
    }
}