import { CanActivate, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UserDto } from '../users/dto/user.dto'
import * as request from 'supertest'
import { DoesUserExist } from '../../core/guards/doesUserExist.guard'
import { AppModule } from '../../app.module'

const newUser: UserDto = {
	name: 'Wellyngton Silva',
	email: 'wellyngton61@gmail.com',
	password: '123456',
	admin: false,
}

describe('AuthController', () => {
	let app: INestApplication

	beforeEach(async () => {
		const mockGuard: CanActivate = { canActivate: jest.fn(() => true) }
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideGuard(DoesUserExist)
			.useValue(mockGuard)
			.compile()

		app = module.createNestApplication()
		await app.init()
	})

	afterEach(async () => {
		await app.close()
	})

	it('create a user', async () => {
		const resp = await request(app.getHttpServer())
			.post('/auth/signup')
			.send(newUser)
		expect(resp.status).toEqual(201)
		expect(resp.body.user.name).toEqual(newUser.name)
	})

	it('login', async () => {
		//login with created user
		const resp = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ username: newUser.email, password: newUser.password })
		expect(resp.status).toEqual(201)
		expect(resp.body.email).toEqual(newUser.email)
		expect(resp.body.token).toBeDefined() // Token criado
	})
})
