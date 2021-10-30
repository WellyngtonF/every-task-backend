import {
	Controller,
	Get,
	Put,
	UseGuards,
	Request,
	Param,
	NotFoundException,
	UnauthorizedException,
	Body,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'
import { User as UserEntity } from './user.entity'
import { UserDto } from './dto/user.dto'
import { UserIsAdmin } from '../../core/guards/userIsAdmin.guard'

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@UseGuards(AuthGuard('jwt'), UserIsAdmin)
	@Get()
	async findAll(@Request() req) {
		// Just admin users can see all users
		if (!req.user.admin) {
			throw new UnauthorizedException(
				'You are not authorized to perform the operation',
			)
		}
		// get all users
		return await this.userService.findAllUsers()
	}

	@UseGuards(AuthGuard('jwt'), UserIsAdmin)
	@Get('email')
	async findOneByEmail(@Body() userBody) {
		const user = await this.userService.findOneByEmail(userBody.email)

		if (!user) {
			throw new NotFoundException("This user doesn't exists")
		}

		return user
	}

	@Get('name')
	async findOneByUsername(@Body() userBody) {
		const user = await this.userService.findOneByUsername(userBody.username)

		if (!user) {
			throw new NotFoundException("This user doesn't exists")
		}

		return user
	}

	@UseGuards(AuthGuard('jwt'), UserIsAdmin)
	@Get(':id')
	async findOneById(@Param('id') id: number): Promise<UserEntity> {
		const user = await this.userService.findOneById(id)

		if (!user) {
			throw new NotFoundException("This user doesn't exists")
		}

		return user
	}

	@UseGuards(AuthGuard('jwt'), UserIsAdmin)
	@Put(':id')
	async update(@Param('id') id: number, @Body() user: UserDto) {
		const { numberOfAffectedRows, updatedUser } =
			await this.userService.update(id, user)

		if (numberOfAffectedRows === 0) {
			throw new NotFoundException("This user doesn't exist")
		}

		return updatedUser
	}
}
