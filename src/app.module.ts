import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './controllers/app.controller'
import { AppService } from './services/app.service'
import { DatabaseModule } from './core/database/database.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { TasksModule } from './modules/tasks/tasks.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		UsersModule,
		AuthModule,
		TasksModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
