import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { tasksProviders } from './tasks.provider'
import { UsersService } from '../users/users.service'
import { usersProviders } from '../users/users.providers'

@Module({
	providers: [
		TasksService,
		...tasksProviders,
		UsersService,
		...usersProviders,
	],
	controllers: [TasksController],
})
export class TasksModule {}
