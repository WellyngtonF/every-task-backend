import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
	NotFoundException,
	UseGuards,
	Request,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TasksService } from './tasks.service'
import { Task as TaskEntity } from './task.entity'
import { TaskDto } from './dto/task.dto'

@Controller('tasks')
export class TasksController {
	constructor(private readonly taskService: TasksService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get()
	async findAll(@Request() req) {
		// Just admin users can see all tasks
		if (!req.user.admin) {
			throw new UnauthorizedException(
				'You are not authorized to perform the operation',
			)
		}
		// get all tasks from db
		return await this.taskService.findAll()
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('open')
	async findOpenTasks(@Request() req) {
		// Just admin users can see all open tasks
		if (!req.user.admin) {
			throw new UnauthorizedException(
				'You are not authorized to perform the operation',
			)
		}
		// get all open tasks from db
		return await this.taskService.findOpenTasks()
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('user')
	async findMyTasks(@Request() req) {
		// get all tasks of logged user from db
		return await this.taskService.findUserAllTasks(req.user.id)
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('user/open')
	async findMyOpenTasks(@Request() req) {
		// get all open tasks of logged user from db
		return await this.taskService.findUserOpenTasks(req.user.id)
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<TaskEntity> {
		// find the task with this id
		const task = await this.taskService.findOne(id)

		// if the task doesn't exist in db, return 404 error
		if (!task) {
			throw new NotFoundException("This task doesn't exist")
		}

		// if task exist, return task
		return task
	}

	@UseGuards(AuthGuard('jwt'))
	@Post()
	async create(@Body() task: TaskDto, @Request() req) {
		// create a new task and return the newly created task
		return await this.taskService.create(task, req.user.id)
	}

	@UseGuards(AuthGuard('jwt'))
	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() task: TaskDto,
		@Request() req,
	): Promise<TaskEntity> {
		// get the number of row affected and the updated task
		const { numberOfAffectedRows, updatedTask } =
			await this.taskService.update(id, task, req.user.id)

		// if the number of row affected is zero, this means the task doesn't exist in db
		if (numberOfAffectedRows === 0) {
			throw new NotFoundException("This Task doesn't exist")
		}

		// return the updated task
		return updatedTask
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	async remove(@Param('id') id: number, @Request() req) {
		// delete the task with this id
		const deleted = await this.taskService.delete(id, req.user.id)

		// if the number of row affected is zero, then the post doesn't exist in db
		if (deleted === 0) {
			throw new NotFoundException("This task doesn't exist ")
		}

		// return success message
		return 'Successfully deleted'
	}

	@UseGuards(AuthGuard('jwt'))
	@Put('close/:id')
	async close(@Param('id') id: number) {
		await this.taskService.closeTask(id)

		return 'Successfully closed'
	}
}
