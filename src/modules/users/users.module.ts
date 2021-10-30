import { Module } from '@nestjs/common'
import { usersProviders } from './users.providers'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'

@Module({
	//imports: [TypeOrmModule.forFeature([User])],
	providers: [UsersService, ...usersProviders],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
