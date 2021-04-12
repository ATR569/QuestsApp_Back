
/**
 * Transform model to JSON and JSON to model
 */
 export interface IJSONTransformable<T> {
    toJSON(): object
    fromJSON(json: any): T
}