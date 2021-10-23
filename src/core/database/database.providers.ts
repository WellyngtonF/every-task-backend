import { Sequelize } from 'sequelize-typescript'
import { User } from 'src/modules/users/user.entity'
import { Task } from 'src/modules/tasks/task.entity'
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants'
import { databaseConfig } from './database.config'

export const databaseProviders = [
	{
		provide: SEQUELIZE,
		useFactory: async () => {
			let config
			switch (process.env.NODE_ENV.trim()) {
				case DEVELOPMENT:
					config = databaseConfig.development
					break
				case TEST:
					config = databaseConfig.test
					break
				case PRODUCTION:
					config = databaseConfig.production
					break
				default:
					config = databaseConfig.development
			}
			const sequelize = new Sequelize(config)
			sequelize.addModels([User, Task]) // Entitys will be added here
			await sequelize.sync()
			return sequelize
		},
	},
]
