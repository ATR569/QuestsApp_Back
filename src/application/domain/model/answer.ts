import { Entity } from './entity'
import { IJSONTransformable } from './json.transformer.interface'

export class Answer extends Entity implements IJSONTransformable<Answer> {
    toJSON(): object {
        id: this.id

        return this
    }
    fromJSON(json: any): Answer {
        if (json.id !== undefined) this.id = json.id

        return this
    }

    


}