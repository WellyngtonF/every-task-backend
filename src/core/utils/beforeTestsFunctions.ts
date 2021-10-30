import * as request from 'supertest'
import { UserDto } from '../../modules/users/dto/user.dto'

const defaultUser: UserDto = {
	name: 'Default user',
	email: 'default@email.com',
	password: '123456',
	admin: true,
}

const noAdminUser: UserDto = {
	name: 'low profile user',
	email: 'noadmin@email.com',
	password: '123456',
	admin: false,
}

export const enum enumUser {
	defaultUser = 'default',
	noAdminUser = 'admin',
}

const getDefaultToken = async (app) => {
	return await getToken(app, defaultUser)
}

const getNoAdminToken = async (app) => {
	return await getToken(app, noAdminUser)
}

const createUserIFNotExist = async (app, user: UserDto) => {
	const resp = await request(app.getHttpServer())
		.get('/users/name')
		.send({ username: user.name })
	if (resp.statusCode === 404) {
		await request(app.getHttpServer()).post('/auth/signup').send(user)
	}
	return
}

const getToken = async (app, user: UserDto) => {
	await createUserIFNotExist(app, user)
	const resp = await request(app.getHttpServer())
		.post('/auth/login')
		.send({ username: user.email, password: user.password })
	return resp.body.token
}

export const getTokenUser = async (app, roleUser: enumUser) => {
	//console.log(roleUser)
	switch (roleUser) {
		case 'default':
			return getDefaultToken(app)
		case 'admin':
			return getNoAdminToken(app)
		default:
			return getDefaultToken(app)
	}
}
