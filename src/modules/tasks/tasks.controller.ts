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
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { TasksService } from './tasks.service'
import { Task as TaskEntity } from './task.entity'
import { TaskDto } from './dto/task.dto'
import { UserIsAdmin } from '../../core/guards/userIsAdmin.guard'
import { FindTaskDto } from './dto/findTask.dto'

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
	constructor(private readonly taskService: TasksService) {}

	@ApiOperation({ summary: 'Find all tasks' })
	@ApiResponse({
		status: 200,
		description: 'tasks',
		type: FindTaskDto,
		isArray: true,
	})
	@ApiUnauthorizedResponse({
		description: 'You are not authorized to perform the operation',
	})
	@UseGuards(AuthGuard('jwt'), UserIsAdmin)
	@Get()
	async findAll() {
		// get all tasks from db
		return await this.taskService.findAll()
	}

	@ApiOperation({ summary: 'Find all open tasks' })
	@ApiResponse({
		status: 200,
		description: 'tasks',
		type: FindTaskDto,
		isArray: true,
	})
	@ApiUnauthorizedResponse({
		description: 'You are not authorized to perform the operation',
	})
	@UseGuards(AuthGuard('jwt'))
	@Get('open')
	async findOpenTasks() {
		// get all open tasks from db
		return await this.taskService.findOpenTasks()
	}

	@ApiOperation({ summary: 'Find all tasks of logged user' })
	@ApiResponse({
		status: 200,
		description: 'tasks',
		type: FindTaskDto,
		isArray: true,
	})
	@UseGuards(AuthGuard('jwt'))
	@Get('user')
	async findMyTasks(@Request() req) {
		// get all tasks of logged user from db
		return await this.taskService.findUserAllTasks(req.user.id)
	}

	@ApiOperation({ summary: 'Find all open tasks of logged user' })
	@ApiResponse({
		status: 200,
		description: 'tasks',
		type: FindTaskDto,
		isArray: true,
	})
	@UseGuards(AuthGuard('jwt'))
	@Get('user/open')
	async findMyOpenTasks(@Request() req) {
		// get all open tasks of logged user from db
		return await this.taskService.findUserOpenTasks(req.user.id)
	}

	@ApiOperation({ summary: 'return one task by id' })
	@ApiParam({
		type: 'number',
		name: 'id',
		example: 1,
	})
	@ApiResponse({
		status: 200,
		description: 'task',
		type: FindTaskDto,
	})
	@ApiNotFoundResponse({ description: "This task doesn't exists" })
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

	@ApiOperation({ summary: 'create a task' })
	@ApiResponse({
		status: 201,
		description: 'task created',
		type: FindTaskDto,
	})
	@UseGuards(AuthGuard('jwt'))
	@Post()
	async create(@Body() task: TaskDto, @Request() req) {
		// create a new task and return the newly created task
		return await this.taskService.create(task, req.user.id)
	}

	@ApiOperation({ summary: 'update a task' })
	@ApiParam({
		type: 'number',
		name: 'id',
		example: 1,
	})
	@ApiResponse({
		status: 200,
		description: 'task',
		type: FindTaskDto,
	})
	@ApiNotFoundResponse({ description: "This task doesn't exists" })
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

	@ApiOperation({ summary: 'delete a task' })
	@ApiParam({
		type: 'number',
		name: 'id',
		example: 1,
	})
	@ApiResponse({
		status: 200,
		description: 'response',
		schema: { type: 'string', example: 'Successfully deleted' },
	})
	@ApiNotFoundResponse({ description: "This task doesn't exists" })
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

	@ApiOperation({ summary: 'close a task' })
	@ApiParam({
		type: 'number',
		name: 'id',
		example: 1,
	})
	@ApiResponse({
		status: 200,
		description: 'response',
		schema: { type: 'string', example: 'Successfully closed' },
	})
	@ApiNotFoundResponse({ description: "This task doesn't exists" })
	@UseGuards(AuthGuard('jwt'))
	@Put('close/:id')
	async close(@Param('id') id: number) {
		await this.taskService.closeTask(id)

		return 'Successfully closed'
	}
}
