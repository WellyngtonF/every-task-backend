import { Task } from './task.entity'
import { TASK_REPOSITORY } from '../../core/constants'

export const tasksProviders = [
	{
		provide: TASK_REPOSITORY,
		useValue: Task,
	},
]
