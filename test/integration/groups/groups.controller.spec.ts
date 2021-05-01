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
import { questionnairesRepository } from '@src/infrastructure/repository/questionnaires.repository'


describe('Routes: Groups', () => {
    const URI = '/groups'
    const server = new SetupServer()
    const request = supertest(server.getApp())

    const group = new GroupMock()
    const user = new UserMock()
    group.administrator = user

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
                        expect(res.body[0]).to.haveOwnProperty('members')
                        expect(res.body[0]).to.haveOwnProperty('questionnaires')

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

        context('When get the a group successfully.', () => {
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
            it('groups.get_id003: should return status 404 for group not found.', () => {
                const INEXISTENT_ID = '111111111111111111111111'

                return request.get(`${URI}/${INEXISTENT_ID}`)
                    .set('Content-Type', 'application/json')
                    .expect(HttpStatus.NOT_FOUND)
                    .then(res => {
                        expect(res.body).to.eql(ExceptionsMock.GROUP.ERROR_404_GROUP_NOT_FOUND)
                    })
            })
        })
    })
})


// {
//     id: 'asldhasodjasoij',
//     administrator: {
//         id: 'asodijasiodjasodpja',
//         name: 'asopdk asopkd poask',
//         institution: 'asdjasiodjasoi',
//         email: 'asodijasiodj'
//     },
//     members: [
//           
//     ],
//     questionnaires: [{
//          id: '321361654564654',
//          discipline: 'askdjasdjasdoi',
//          questions_count: 10 
//     }]/
//}

// question
//     answer
//         answercomments

// [{
//     id: 'asldhasodjasoij',
//     administrator: {
//         id: 'asodijasiodjasodpja',
//         name: 'asopdk asopkd poask',
//         institution: 'asdjasiodjasoi',
//         email: 'asodijasiodj'
//     },
//     members_count: 3,
//     questionaires_count: 5
// }]

// /groups/id/questionnaires

// [{
//      id: '321361654564654',
//      discipline: 'askdjasdjasdoi',
//      questions_count: 10 
// }]