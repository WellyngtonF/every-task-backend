import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { tasksProviders } from './tasks.provider'

@Module({
	providers: [TasksService, ...tasksProviders],
	controllers: [TasksController],
})
export class TasksModule {}
