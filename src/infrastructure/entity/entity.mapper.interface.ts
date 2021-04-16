import { Entity } from '@src/application/domain/model/entity'

/**
 * Convert a Model to an entityModel and vice versa
 */
export interface IEntityMapper<TModel extends Entity, TEntityModel> {
    transform(item: any): TModel | TEntityModel

    modelToEntityModel(model: TModel): TEntityModel

    jsonToModel(json: any): TModel
}