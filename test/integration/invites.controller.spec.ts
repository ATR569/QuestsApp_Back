import '../../src/utils/module-alias'
import { InvitesDBUtils } from '@test/utils/database/invites.db.utils'
import { GroupsDBUtils } from '@test/utils/database/groups.db.utils'
import { UsersDBUtils } from '@test/utils/database/user.db.utils'
import { UserMock } from '@test/mocks/models/user.mock'
import { InviteMock } from '@test/mocks/models/invite.mock'
import { GroupMock } from '@test/mocks/models/group.mock'
import supertest from 'supertest'
import HttpStatus from 'http-status-codes'
import { expect } from 'chai'
import { ExceptionsMock } from '@test/mocks/exceptions.mock'
import { InviteStatus } from '@src/application/domain/model/invite'
import { User } from '@src/application/domain/model/User'
import { Group } from '@src/application/domain/model/group'
import { server } from '@test/utils/database/connection.db'
import { ObjectID } from 'bson'

describe('Routes: Invites', () => {
    const URI = '/invites'
    const request = supertest(server.getApp())

    const group = new GroupMock()
    const user = new UserMock()
    const anotherUser = new UserMock()
    anotherUser.email = 'another@mail.com'
    group.administrator = user
    group.members = [user]

    const invite = new InviteMock()
    invite.group = group
    invite.user = anotherUser

    before(async () => {
        try {
            await server.init()
            await server.start()
            await UsersDBUtils.removeAllUsers()
            await GroupsDBUtils.removeAllGroups()
            await InvitesDBUtils.removeAllInvites()
        } catch (err) {
            console.log('Failure on before all tests for /invites', err.message)
        }
    })

    after(async () => {
        try {
            await UsersDBUtils.removeAllUsers()
            await GroupsDBUtils.removeAllGroups()
            await InvitesDBUtils.removeAllInvites()
        } catch (err) {
            console.log('Failure on after all tests for /invites', err.message)
        }
    })

    describe('POST /invites', () => {
        before(async () => {
            try {
                await UsersDBUtils.saveUser(user.toJSON())
                    .then(res => user.id = res.id)
                await UsersDBUtils.saveUser(anotherUser.toJSON())
                    .then(res => anotherUser.id = res.id)
                await GroupsDBUtils.saveGroup(group.toJSON())
                    .then(res => group.id = res.id)
            } catch (err) {
                console.log('Failure on before tests for POST /invites', err.message)
            }
        })

        after(async () => {
            try {
                await UsersDBUtils.removeAllUsers()
                await GroupsDBUtils.removeAllGroups()
            } catch (err) {
                console.log('Failure on before tests for POST /invites', err.message)
            }
        })

        afterEach(async () => {
            try {
                await InvitesDBUtils.removeAllInvites()
            } catch (err) {
                console.log('Failure on afterEach tests for POST /invites', err.message)
            }
        })

        context('When creates a invite successfully.', () => {
            it('invites.post001: should return status code 201 and the created invite.', () => {
                const body = invite.toJSON()

                return request.post(URI)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.CREATED)
                    .then(res => {
                        expect(res.body).to.haveOwnProperty('id')
                        expect(res.body).to.haveOwnProperty('group')
                        expect(res.body).to.haveOwnProperty('user')
                        expect(res.body).to.haveOwnProperty('status', 'pending')

                        expect(res.body.group).to.haveOwnProperty('id', group.id)
                        expect(res.body.group).to.haveOwnProperty('name', group.name)
                        expect(res.body.group).to.haveOwnProperty('administrator')
                        expect(res.body.group).to.haveOwnProperty('members')
                        expect(res.body.group).to.haveOwnProperty('questionnaires')

                        expect(res.body.user).to.haveOwnProperty('id', anotherUser.id)
                        expect(res.body.user).to.haveOwnProperty('name', anotherUser.name)
                        expect(res.body.user).to.haveOwnProperty('email', anotherUser.email)
                        expect(res.body.user).to.haveOwnProperty('institution', anotherUser.institution)
                    })
            })
        })

        context('When a duplication ocurrs.', () => {
            before(async () => {
                try {
                    await InvitesDBUtils.saveInvite({
                        group: invite.group!.id,
                        user: invite.user!.id,
                        status: InviteStatus.PENDING
                    })
                } catch (err) {
                    console.log('Failure on before duplication test for POST /invites', err.message)
                }
            })

            it('invites.post002: should return status code 409 and an info message when the invite is already registered.', () => {
                const body = invite.toJSON()

                return request.post(URI)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.CONFLICT)
                    .then(res => {
                        expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_409_ALREADY_EXISTING_INVITE)
                    })
            })
        })

        context('When the user already belongs to the group.', () => {
            before(async () => {
                try {
                    await GroupsDBUtils.addMemberToGroup(anotherUser, group)
                } catch (err) {
                    console.log('Failure on before duplication test for POST /invites', err.message)
                }
            })

            it('invites.post003: should return status code 409 and an info message for invited user is already belongs to the group.', () => {
                const body = invite.toJSON()

                return request.post(URI)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.CONFLICT)
                    .then(res => {
                        expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_409_USER_ALREADY_IN_GROUP)
                    })
            })
        })

        context('When the user not found.', () => {
            let wrongInvite: InviteMock

            before(() => {
                wrongInvite = new InviteMock()
                wrongInvite.group = group
            })

            it('invites.post004: should return status 404 for user not found.', () => {
                const body = wrongInvite.toJSON()

                return request.post(URI)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.NOT_FOUND)
                    .then(res => {
                        expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_404_USER_NOT_REGISTERED)
                    })
            })
        })

        context('When the group not found.', () => {
            let wrongInvite: InviteMock

            before(() => {
                wrongInvite = new InviteMock()
                wrongInvite.user = anotherUser
            })

            it('invites.post004: should return status 404 for group not found.', () => {
                const body = wrongInvite.toJSON()

                return request.post(URI)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.NOT_FOUND)
                    .then(res => {
                        expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_404_GROUP_NOT_REGISTERED)
                    })
            })
        })

        describe('When a validation error ocurrs.', () => {
            const wrongInvite: InviteMock = new InviteMock()

            context('When provide invalid fields.', () => {
                it('invites.post005: should return an error 400 and an info message for invalid user id.', () => {
                    wrongInvite.group = group
                    wrongInvite.user = new User()
                    wrongInvite.user.id = '123456'

                    const body = wrongInvite.toJSON()

                    return request.post(URI)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_400_INVALID_USER_ID)
                        })
                })

                it('invites.post006: should return an error 400 and an info message for invalid group id.', () => {
                    wrongInvite.group = new Group()
                    wrongInvite.user = user
                    wrongInvite.group.id = '123456'

                    const body = wrongInvite.toJSON()

                    return request.post(URI)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_400_INVALID_GROUP_ID)
                        })
                })
            })

            context('When required fields not provided.', () => {
                it('invites.post007: should return an error 400 and an info message for user id not provided.', () => {
                    wrongInvite.user = undefined
                    wrongInvite.group = group

                    const body = wrongInvite.toJSON()

                    return request.post(URI)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_400_USER_ID_NOT_PROVIDED)
                        })
                })

                it('invites.post008: should return an error 400 and an info message for user id not provided.', () => {
                    wrongInvite.user = new User()
                    wrongInvite.group = group
                    wrongInvite.user.id = undefined

                    const body = wrongInvite.toJSON()

                    return request.post(URI)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_400_USER_ID_NOT_PROVIDED)
                        })
                })

                it('invites.post009: should return an error 400 and an info message for group id not provided.', () => {
                    wrongInvite.user = user
                    wrongInvite.group = undefined

                    const body = wrongInvite.toJSON()

                    return request.post(URI)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_400_GROUP_ID_NOT_PROVIDED)
                        })
                })

                it('invites.post010: should return an error 400 and an info message for group id not provided.', () => {
                    wrongInvite.user = user
                    wrongInvite.group = new Group()
                    wrongInvite.group.id = undefined

                    const body = wrongInvite.toJSON()

                    return request.post(URI)
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.INVITE.ERROR_400_GROUP_ID_NOT_PROVIDED)
                        })
                })
            })
        })
    })

    describe('GET /invites', () => {
        context('When there are invites registered.', () => {
            before(async () => {
                try {
                    await UsersDBUtils.saveUser(user.toJSON())
                        .then(res => user.id = res.id)
                    await UsersDBUtils.saveUser(anotherUser.toJSON())
                        .then(res => anotherUser.id = res.id)
                    await GroupsDBUtils.saveGroup(group.toJSON())
                        .then(res => group.id = res.id)
                    await InvitesDBUtils.saveInvite({ group: invite.group!.id, user: invite.user!.id, status: InviteStatus.PENDING })
                        .then(res => invite.id = res.id)
                } catch (err) {
                    console.log('Failure on before tests for GET /invites', err.message)
                }
            })

            after(async () => {
                try {
                    await UsersDBUtils.removeAllUsers()
                    await GroupsDBUtils.removeAllGroups()
                    await InvitesDBUtils.removeAllInvites()
                } catch (err) {
                    console.log('Failure on afterEach tests for GET /invites', err.message)
                }
            })

            it('invites.get_all001: should return status 200 and the list of invites.', () => {
                return request.get(URI)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body).instanceOf(Array)
                        expect(res.body).length(1)

                        expect(res.body[0]).haveOwnProperty('group')
                        expect(res.body[0].group).to.haveOwnProperty('id', group.id)
                        expect(res.body[0].group).to.haveOwnProperty('name', group.name)
                        expect(res.body[0].group).to.haveOwnProperty('administrator')
                        expect(res.body[0].group).to.haveOwnProperty('members')
                        expect(res.body[0].group).to.haveOwnProperty('questionnaires')

                        expect(res.body[0]).haveOwnProperty('user')
                        expect(res.body[0].user).to.haveOwnProperty('id', anotherUser.id)
                        expect(res.body[0].user).to.haveOwnProperty('name', anotherUser.name)
                        expect(res.body[0].user).to.haveOwnProperty('email', anotherUser.email)
                        expect(res.body[0].user).to.haveOwnProperty('institution', anotherUser.institution)

                        expect(res.body[0]).to.haveOwnProperty('status', InviteStatus.PENDING)
                    })
            })

            it('invites.get_all002: should return status 200 and the list of invites that match to the query.', () => {
                return request.get(URI)
                    .set('Content-Type', 'application/json')
                    .query({ user: anotherUser.id })
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body).instanceOf(Array)
                        expect(res.body).length(1)

                        expect(res.body[0]).haveOwnProperty('group')
                        expect(res.body[0].group).to.haveOwnProperty('id', group.id)
                        expect(res.body[0].group).to.haveOwnProperty('name', group.name)
                        expect(res.body[0].group).to.haveOwnProperty('administrator')
                        expect(res.body[0].group).to.haveOwnProperty('members')
                        expect(res.body[0].group).to.haveOwnProperty('questionnaires')

                        expect(res.body[0]).haveOwnProperty('user')
                        expect(res.body[0].user).to.haveOwnProperty('id', anotherUser.id)
                        expect(res.body[0].user).to.haveOwnProperty('name', anotherUser.name)
                        expect(res.body[0].user).to.haveOwnProperty('email', anotherUser.email)
                        expect(res.body[0].user).to.haveOwnProperty('institution', anotherUser.institution)

                        expect(res.body[0]).to.haveOwnProperty('status', InviteStatus.PENDING)
                    })
            })

            it('invites.get_all003: should return status 200 and the an empty list when there is no invites that match to the query.', () => {
                return request.get(URI)
                    .set('Content-Type', 'application/json')
                    .query({ user: new ObjectID().toHexString() })
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body).instanceOf(Array)
                        expect(res.body).length(0)
                    })
            })
        })

        context('When there are no invites registered.', () => {
            it('invites.get_all004: should return status 200 and an empty list.', () => {
                return request.get(URI)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body).to.eql([])
                    })
            })
        })
    })
})