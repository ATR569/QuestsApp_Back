import '../../../src/utils/module-alias'
import { GroupsDBUtils } from '@test/utils/database/groups.db.utils'
import { UserMock } from '@test/mocks/models/user.mock'
import { GroupMock } from '@test/mocks/models/group.mock'
import { UsersDBUtils } from '@test/utils/database/user.db.utils'
import { SetupServer } from '@src/server'
import supertest from 'supertest'
import HttpStatus from 'http-status-codes'
import { expect } from 'chai'
import { ExceptionsMock } from '../../mocks/exceptions.mock'
import { ObjectID } from 'bson'


describe('Routes: Groups', () => {
    const URI = '/groups'
    const server = new SetupServer()
    const request = supertest(server.getApp())

    const group = new GroupMock()
    const user = new UserMock()
    group.administrator = user
    group.members = [user]

    before(async () => {
        try {
            await server.init()
            await server.start()
            await UsersDBUtils.removeAllUsers()
            await GroupsDBUtils.removeAllGroups()
        } catch (err) {
            console.log('Failure on before all tests for /groups', err.message)
        }
    })

    after(async () => {
        try {
            await UsersDBUtils.removeAllUsers()
            await GroupsDBUtils.removeAllGroups()
        } catch (err) {
            console.log('Failure on after all tests for /groups', err.message)
        }
    })

    describe('POST /groups', () => {
        before(async () => {
            try {
                await UsersDBUtils.saveUser(user.toJSON())
                    .then(res => user.id = res.id)
            } catch (err) {
                console.log('Failure on before tests for POST /groups', err.message)
            }
        })

        after(async () => {
            try {
                await UsersDBUtils.removeAllUsers()
            } catch (err) {
                console.log('Failure on before tests for POST /groups', err.message)
            }
        })

        afterEach(async () => {
            try {
                await GroupsDBUtils.removeAllGroups()
            } catch (err) {
                console.log('Failure on afterEach tests for POST /groups', err.message)
            }
        })

        context('When creates a group successfully.', () => {
            it('groups.post001: shold return status code 200 and the created group.', () => {
                const body = group.toJSON()

                return request.post(URI)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.CREATED)
                    .then(res => {
                        expect(res.body).to.haveOwnProperty('id')
                        expect(res.body).to.haveOwnProperty('name', group.name)

                        expect(res.body).to.haveOwnProperty('members')
                        expect(res.body.members).to.instanceOf(Array)
                        expect(res.body.members).to.length(1)
                        expect(res.body.members[0]).to.haveOwnProperty('id', user.id)
                        expect(res.body.members[0]).to.haveOwnProperty('name', user.name)

                        expect(res.body).to.haveOwnProperty('questionnaires')
                        expect(res.body.questionnaires).to.eql([])
                    })
            })
        })

        context('When a duplication ocurrs.', () => {
            before(async () => {
                try {
                    await GroupsDBUtils.saveGroup(group.toJSON())
                } catch (err) {
                    console.log('Failure on before duplication test for POST /groups', err.message)
                }
            })

            it('groups.post002: shold return status code 409 and an info message when pass an existent email.', () => {
                const body = group.toJSON()

                return request.post(URI)
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.CONFLICT)
                    .then(res => {
                        expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_409_ALREADY_EXISTING_NAME)
                    })
            })
        })

        describe('When a validation error ocurrs.', () => {
            context('When a required field is not provided.', () => {
                it('groups.post003: should return an error 400 and an info message for required name.', () => {
                    const invalidGroup: any = group.toJSON()
                    invalidGroup.name = undefined

                    return request.post(URI)
                        .send(invalidGroup)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_NAME_NOT_PROVIDED)
                        })
                })

                it('groups.post004: should return an error 400 and an info message for required administrator.', () => {
                    const invalidGroup: any = group.toJSON()
                    invalidGroup.administrator = undefined

                    return request.post(URI)
                        .send(invalidGroup)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_ADMINISTRATOR_NOT_PROVIDED)
                        })
                })
            })

            context('When provide a invalid field.', () => {
                it('groups.post005: should return an error 400 and an info message for invalid name.', () => {
                    const invalidGroup: any = group.toJSON()
                    invalidGroup.name = ''

                    return request.post(URI)
                        .send(invalidGroup)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_EMPTY_NAME)
                        })
                })

                it('groups.post006: should return an error 400 and an info message for invalid administrator id.', () => {
                    const invalidGroup: any = group.toJSON()
                    invalidGroup.administrator.id = '123'

                    return request.post(URI)
                        .send(invalidGroup)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_INVALID_ADMINISTRATOR_ID)
                        })
                })

                it('groups.post007: should return an error 404 and an info message for administrator not registered.', () => {
                    const invalidGroup: any = group.toJSON()
                    invalidGroup.administrator.id = new ObjectID().toHexString()

                    return request.post(URI)
                        .send(invalidGroup)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.NOT_FOUND)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_404_ADMINISTRATOR_NOT_REGISTERED)
                        })
                })
            })
        })
    })

    describe('GET /groups', () => {

        context('When there are groups registered.', () => {
            before(async () => {
                try {
                    await UsersDBUtils.saveUser(user.toJSON())
                        .then(res => user.id = res.id)
                    await GroupsDBUtils.saveGroup(group.toJSON())
                        .then(res => group.id = res.id)
                } catch (err) {
                    console.log('Failure on before tests for GET /groups', err.message)
                }
            })

            after(async () => {
                try {
                    await UsersDBUtils.removeAllUsers()
                    await GroupsDBUtils.removeAllGroups()
                } catch (err) {
                    console.log('Failure on afterEach tests for GET /groups', err.message)
                }
            })

            it('groups.get_all001: should return status 200 and the list of groups.', () => {
                return request.get(URI)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body).instanceOf(Array)
                        expect(res.body).length(1)

                        expect(res.body[0]).to.haveOwnProperty('id', group.id)
                        expect(res.body[0]).to.haveOwnProperty('name', group.name)
                        expect(res.body[0]).to.haveOwnProperty('administrator')
                        expect(res.body[0]).to.haveOwnProperty('membersCount', 1)
                        expect(res.body[0]).to.haveOwnProperty('questionnairesCount', 0)

                        expect(res.body[0].administrator).to.haveOwnProperty('id', user.id)
                        expect(res.body[0].administrator).to.haveOwnProperty('name', user.name)
                        expect(res.body[0].administrator).to.haveOwnProperty('email', user.email)
                        expect(res.body[0].administrator).to.haveOwnProperty('institution', user.institution)
                    })
            })
        })

        context('When there are no groups registered.', () => {
            it('groups.get_all002: should return status 200 and an empty list.', () => {
                return request.get(URI)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body).to.eql([])
                    })
            })
        })
    })

    describe('GET /groups/:{group_id}', () => {
        before(async () => {
            try {
                await UsersDBUtils.saveUser(user.toJSON())
                    .then(res => user.id = res.id)
                await GroupsDBUtils.saveGroup(group.toJSON())
                    .then(res => group.id = res.id)
            } catch (err) {
                console.log('Failure on before tests for GET /groups/:{group_id}', err.message)
            }
        })

        after(async () => {
            try {
                await UsersDBUtils.removeAllUsers()
                await GroupsDBUtils.removeAllGroups()
            } catch (err) {
                console.log('Failure on afterEach tests for GET /groups/:{group_id', err.message)
            }
        })

        context('When get the group successfully.', () => {
            it('groups.get_id001: should return status 200 and the group.', () => {
                return request.get(`${URI}/${group.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body).to.haveOwnProperty('id', group.id)
                        expect(res.body).to.haveOwnProperty('name', group.name)
                        expect(res.body).to.haveOwnProperty('administrator')
                        expect(res.body).to.haveOwnProperty('members')
                        expect(res.body).to.haveOwnProperty('questionnaires')

                        expect(res.body.administrator).to.haveOwnProperty('id', user.id)
                        expect(res.body.administrator).to.haveOwnProperty('name', user.name)
                        expect(res.body.administrator).to.haveOwnProperty('email', user.email)
                        expect(res.body.administrator).to.haveOwnProperty('institution', user.institution)
                    })
            })
        })

        context('When the group not found.', () => {
            it('groups.get_id002: should return status 404 for group not found.', () => {
                const INEXISTENT_ID = '111111111111111111111111'

                return request.get(`${URI}/${INEXISTENT_ID}`)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.NOT_FOUND)
                    .then(res => {
                        expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_404_GROUP_NOT_FOUND)
                    })
            })
        })

        context('When the group_id is invalid.', () => {
            it('groups.get_id003: should return status 400 for invalid group id.', () => {
                const INVALID_ID = '12345'

                return request.get(`${URI}/${INVALID_ID}`)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.BAD_REQUEST)
                    .then(res => {
                        expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_INVALID_GROUP_ID)
                    })
            })
        })
    })

    describe('PATCH /groups/:{group_id}', () => {
        beforeEach(async () => {
            try {
                await UsersDBUtils.saveUser(user.toJSON())
                    .then(res => user.id = res.id)
                await GroupsDBUtils.saveGroup(group.toJSON())
                    .then(res => group.id = res.id)
            } catch (err) {
                console.log('Failure on before tests for PATCH /groups/:{group_id}', err.message)
            }
        })

        afterEach(async () => {
            try {
                await UsersDBUtils.removeAllUsers()
                await GroupsDBUtils.removeAllGroups()
            } catch (err) {
                console.log('Failure on afterEach tests for PATCH /groups/:{group_id', err.message)
            }
        })

        context('When update the group successfully.', () => {
            it('groups.patch001: should return status 200 and the updated group.', () => {
                const updatedGroup = {
                    id: group.id,
                    name: 'updated group',
                    administrator: {
                        id: group.administrator?.id
                    }
                }

                return request.patch(`${URI}/${updatedGroup.id}`)
                    .send(updatedGroup)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res.body).to.haveOwnProperty('id', group.id)
                        expect(res.body).to.haveOwnProperty('name', updatedGroup.name)
                        expect(res.body).to.haveOwnProperty('administrator')
                        expect(res.body).to.haveOwnProperty('members')
                        expect(res.body).to.haveOwnProperty('questionnaires')

                        expect(res.body.administrator).to.haveOwnProperty('id', user.id)
                        expect(res.body.administrator).to.haveOwnProperty('name', user.name)
                        expect(res.body.administrator).to.haveOwnProperty('email', user.email)
                        expect(res.body.administrator).to.haveOwnProperty('institution', user.institution)
                    })
            })
        })

        context('When the group not found.', () => {
            it('groups.patch002: should return status 404 for group not found.', () => {
                const NON_EXISTENT_ID = new ObjectID().toHexString()

                return request.patch(`${URI}/${NON_EXISTENT_ID}`)
                    .send({ name: 'updated name' })
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.NOT_FOUND)
                    .then(res => {
                        expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_404_GROUP_NOT_FOUND)
                    })
            })
        })

        describe('When a validation error ocurrs.', () => {
            context('When the group id is invalid.', () => {
                it('groups.patch003: should return status 400 and an error for invalid id.', () => {
                    const INVALID_ID = '123456'

                    return request.patch(`${URI}/${INVALID_ID}`)
                        .send({ name: 'updated name' })
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_INVALID_GROUP_ID)
                        })
                })
            })

            context('When invalid fields are provided.', () => {
                it('groups.patch004: should return status 400 and an error for empty name.', () => {
                    return request.patch(`${URI}/${group.id}`)
                        .send({ name: '' })
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_EMPTY_NAME)
                        })
                })

                it('groups.patch005: should return status 400 and an error for wrong format administrator id.', () => {
                    const wrongBody = {
                        administrator: { id: '' }
                    }

                    return request.patch(`${URI}/${group.id}`)
                        .send(wrongBody)
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_INVALID_ADMINISTRATOR_ID)
                        })
                })
            })

            context('When a duplication ocurrs.', () => {
                let anotherGroup: GroupMock
                
                before(async () => {
                    try {
                        anotherGroup = new GroupMock()
                        anotherGroup.name = 'another group'
                        anotherGroup.administrator = user
                        anotherGroup.members = [ user ]

                        await GroupsDBUtils.saveGroup(anotherGroup.toJSON())
                            .then(res => anotherGroup.id = res.id)
                    } catch (err) {
                        console.log('Failure on before tests for PATCH /groups/:{group_id}', err.message)
                    }
                })

                it('groups.patch006: should return status 409 when name updated is already registered.', () => {
                    return request.patch(`${URI}/${anotherGroup.id}`)
                        .send({ name: 'Group mock' })
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.CONFLICT)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_409_ALREADY_EXISTING_NAME)
                        })
                })
            })

            context('When the field cant updated.', () => {
                it('groups.patch007: should return status 400 and a info message for field members cant be updated.', () => {
                    const members = [ user ]

                    return request.patch(`${URI}/${group.id}`)
                        .send({ members })
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_MEMBERS_CANT_BE_APDATED)
                        })
                })

                it('groups.patch008: should return status 400 and a info message for field questionnaires cant be updated.', () => {
                    const questionnaires = [
                        { id: '123456789123456789123456' }
                    ]
                    return request.patch(`${URI}/${group.id}`)
                        .send({ questionnaires })
                        .set('Content-Type', 'application/json')
                        .expect(HttpStatus.BAD_REQUEST)
                        .then(res => {
                            expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_400_QUESTIONNAIRES_CANT_BE_APDATED)
                        })
                })
            })
        })
    })
})