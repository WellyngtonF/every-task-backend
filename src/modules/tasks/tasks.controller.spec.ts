import { CanActivate, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { TaskDto } from './dto/task.dto'
import { DoesUserExist } from '../../core/guards/doesUserExist.guard'
import { AppModule } from '../../app.module'
import { getTokenUser, enumUser } from '../../core/utils/beforeTestsFunctions'
import { Task } from './task.entity'

const arrayTask: TaskDto[] = [
	{
		description: 'Test the task',
	},
	{
		description: 'second task',
	},
]

const returnTask = async (
	app: INestApplication,
	taskId: number,
	token: string,
) => {
	return await request(app.getHttpServer())
		.get(`/tasks/${taskId}`)
		.auth(token, { type: 'bearer' })
}

const createTask = async (
	app: INestApplication,
	task: TaskDto,
	token: string,
) => {
	return await request(app.getHttpServer())
		.post('/tasks')
		.send({ description: task.description })
		.auth(token, { type: 'bearer' })
}

describe('TasksController', () => {
	let app: INestApplication
	let token: string
	let defaultTask: Task

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
		await app.close()
	})

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

	it('create task', async () => {
		const resp = await createTask(app, arrayTask[0], token)
		defaultTask = resp.body
		expect(resp.status).toEqual(201)
		expect(resp.body.description).toEqual(arrayTask[0].description)
	})

	it('return a task', async () => {
		const resp = await returnTask(app, defaultTask.id, token)
		expect(resp.body.description).toEqual(arrayTask[0].description)
	})

	it('return all tasks', async () => {
		await createTask(app, arrayTask[1], token)
		const resp = await request(app.getHttpServer())
			.get('/tasks')
			.auth(token, { type: 'bearer' })
		expect(resp.body).toHaveLength(arrayTask.length)
		expect(resp.status).toEqual(200)
		expect(resp.body[1].description).toEqual(arrayTask[1].description)
	})

	it('update task', async () => {
		const resp = await request(app.getHttpServer())
			.put(`/tasks/${defaultTask.id}`)
			.send({ description: 'close task' })
			.auth(token, { type: 'bearer' })
		defaultTask = resp.body
		expect(resp.status).toEqual(200)
		expect(resp.body.description).toEqual('close task')
	})

	it('close task', async () => {
		const resp = await request(app.getHttpServer())
			.put(`/tasks/close/${defaultTask.id}`)
			.send()
			.auth(token, { type: 'bearer' })
		const task = await returnTask(app, defaultTask.id, token)
		expect(task.body.isClosed).toEqual(true)
		expect(resp.status).toEqual(200)
	})

	it('remove task', async () => {
		const resp = await request(app.getHttpServer())
			.delete(`/tasks/${defaultTask.id}`)
			.send()
			.auth(token, { type: 'bearer' })
		expect(resp.status).toEqual(200)
	})
})
