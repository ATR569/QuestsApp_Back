import { Entity } from './entity'
import { Group } from './group'
import { User } from './User'
import { IJSONTransformable } from './json.transformer.interface'

export enum InviteStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DENIED = 'denied',
}

export class Invite extends Entity implements IJSONTransformable<Invite>{
    private _date?: string
    private _group?: Group
    private _user?: User
    private _status?: InviteStatus

    get date(): string | undefined {
        return this._date
    }

    set date(date: string | undefined) {
        this._date = date
    }

    get group(): Group | undefined {
        return this._group
    }

    set group(group: Group | undefined) {
        this._group = group
    }

    get user(): User | undefined {
        return this._user
    }

    set user(user: User | undefined) {
        this._user = user
    }

    get status(): InviteStatus | undefined {
        return this._status
    }

    set status(status: InviteStatus | undefined) {
        this._status = status
    }

    public toJSON(): object {
        return {
            id: this.id,
            group: this.group ? this.group.toJSON() : undefined,
            user: this.user ? this.user.toJSON() : undefined,
            status: this.status
        }
    }

    public fromJSON(json: any): Invite {
        if (json === undefined) {
            json = {}
        }

        if (json.id !== undefined) this.id = json.id
        if (json.group !== undefined) this.group = new Group().fromJSON(json.group)
        if (json.user !== undefined) this.user = new User().fromJSON(json.user)
        if (json.status !== undefined) this.status = json.status

        return this
    }
}