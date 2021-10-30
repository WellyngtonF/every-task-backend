import { Sequelize } from 'sequelize-typescript'
import { databaseConfig } from '../database/database.config'
import { User } from '../../modules/users/user.entity'
import { Task } from '../../modules/tasks/task.entity'

export default async () => {
	const config: any = databaseConfig.test
	const sequelize = new Sequelize(config)
	sequelize.addModels([User, Task])
	await sequelize.sync({ force: true })
	sequelize.close()
	console.log('\nDatabase clean')
}
