import { CanActivate, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { DoesUserExist } from '../../core/guards/doesUserExist.guard'
import { AppModule } from '../../app.module'
import { getTokenUser, enumUser } from '../../core/utils/beforeTestsFunctions'
import { User } from './user.entity'

describe('UsersController', () => {
	let app: INestApplication
	let token: string
	let noAdminToken: string
	let defaultUser: User

	beforeAll(async () => {
		const mockGuard: CanActivate = { canActivate: jest.fn(() => true) }
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideGuard(DoesUserExist)
			.useValue(mockGuard)
			.compile()

		app = module.createNestApplication()
		await app.init()

		token = await getTokenUser(app, enumUser.defaultUser)
		noAdminToken = await getTokenUser(app, enumUser.noAdminUser)
		await app.close()
	})

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = module.createNestApplication()
		await app.init()
	})

	afterEach(async () => {
		await app.close()
	})

	it('user should be admin', async () => {
		const resp = await request(app.getHttpServer())
			.get('/users')
			.auth(noAdminToken, { type: 'bearer' })
		expect(resp.status).toEqual(401)
	})

	it('return all users', async () => {
		const resp = await request(app.getHttpServer())
			.get('/users')
			.auth(token, { type: 'bearer' })
		expect(resp.status).toEqual(200)
	})

	it('return user by id', async () => {
		const resp = await request(app.getHttpServer())
			.get('/users/1')
			.auth(token, { type: 'bearer' })
		defaultUser = resp.body
		expect(resp.status).toEqual(200)
	})

	it('return user by email', async () => {
		const resp = await request(app.getHttpServer())
			.get(`/users/email/${defaultUser.email}`)
			.auth(token, { type: 'bearer' })
		expect(resp.status).toEqual(200)
		expect(resp.body.name).toEqual(defaultUser.name)
	})

	it('return user by name', async () => {
		const resp = await request(app.getHttpServer())
			.get(`/users/name/${defaultUser.name}`)
			.auth(token, { type: 'bearer' })
		expect(resp.status).toEqual(200)
		expect(resp.body.name).toEqual(defaultUser.name)
	})

	it('update user', async () => {
		const resp = await request(app.getHttpServer())
			.put(`/users/${defaultUser.id}`)
			.send({ ...defaultUser, name: 'default user changed' })
			.auth(token, { type: 'bearer' })
		expect(resp.status).toEqual(200)
		expect(resp.body.name).toEqual('default user changed')
		await request(app.getHttpServer())
			.put(`/users/${defaultUser.id}`)
			.send({ ...defaultUser })
			.auth(token, { type: 'bearer' })
	})
})
