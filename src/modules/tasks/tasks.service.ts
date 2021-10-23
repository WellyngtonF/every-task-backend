import { Injectable, Inject } from '@nestjs/common'
import { Task } from './task.entity'
import { TaskDto } from './dto/task.dto'
import { User } from '../users/user.entity'
import { TASK_REPOSITORY } from 'src/core/constants'

@Injectable()
export class TasksService {
	constructor(@Inject(TASK_REPOSITORY) private readonly taskRepository) {}

	async create(task: TaskDto, userId: number): Promise<Task> {
		return await this.taskRepository.create({ ...task, userId })
	}

	async findAll(): Promise<Task> {
		return await this.taskRepository.findAll({
			include: [{ model: User, attributes: ['name'] }],
			raw: true,
		})
	}

	async findOpenTasks(): Promise<TaskDto> {
		return await this.taskRepository.findAll({
			where: { isClosed: false },
			include: [{ model: User, attributes: ['name'] }],
			raw: true,
		})
	}

	async findUserAllTasks(userId): Promise<TaskDto> {
		return await this.taskRepository.findAll({
			where: {
				userId,
			},
		})
	}

	async findUserOpenTasks(userId): Promise<TaskDto> {
		return await this.taskRepository.findAll({
			where: {
				userId,
				isClosed: false,
			},
		})
	}

	async findOne(id): Promise<Task> {
		return await this.taskRepository.findOne({
			where: { id },
			include: [{ model: User, attributes: ['name'] }],
			raw: true,
		})
	}

	async update(id, data, userId) {
		const [numberOfAffectedRows, [updatedTask]] =
			await this.taskRepository.update(
				{ ...data },
				{ where: { id, userId }, returning: true },
			)

		return { numberOfAffectedRows, updatedTask }
	}

	async closeTask(id): Promise<TaskDto> {
		const updatedTask = await this.taskRepository.update(
			{
				isClosed: true,
				dateClosed: Date.now(),
			},
			{ where: { id }, returning: true },
		)

		return updatedTask
	}

	async delete(id, userId) {
		return await this.taskRepository.destroy({ where: { id, userId } })
	}
}
