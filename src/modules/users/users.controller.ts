import {
	Controller,
	Get,
	Put,
	UseGuards,
	Param,
	NotFoundException,
	Body,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiNotFoundResponse,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiParam,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'
import { User as UserEntity } from './user.entity'
import { UserDto } from './dto/user.dto'
import { UserIsAdmin } from '../../core/guards/userIsAdmin.guard'
import { FindUserDto } from './dto/findOne.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@ApiOperation({ summary: 'return all users' })
	@ApiResponse({
		status: 200,
		description: 'users',
		type: FindUserDto,
		isArray: true,
	})
	@ApiResponse({
		status: 401,
		description: 'You are not authorized to perform the operation',
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'), UserIsAdmin)
	@Get()
	async findAll() {
		// get all users
		return await this.userService.findAllUsers()
	}

	@ApiOperation({ summary: 'return one user by email' })
	@ApiParam({
		type: 'string',
		name: 'email',
		example: 'wellyngton61@gmail.com',
	})
	@ApiResponse({
		status: 200,
		description: 'user',
		type: FindUserDto,
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiNotFoundResponse({ description: "This user doesn't exists" })
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'), UserIsAdmin)
	@Get('email/:email')
	async findOneByEmail(@Param('email') email: string) {
		const user = await this.userService.findOneByEmail(email)

		if (!user) {
			throw new NotFoundException("This user doesn't exists")
		}

		return user
	}

	@ApiOperation({ summary: 'return one user by name' })
	@ApiParam({
		type: 'string',
		name: 'username',
		example: 'Wellyngton Silva',
	})
	@ApiResponse({
		status: 200,
		description: 'user',
		type: FindUserDto,
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiNotFoundResponse({ description: "This user doesn't exists" })
	@Get('name/:username')
	async findOneByUsername(@Param('username') username: string) {
		const user = await this.userService.findOneByUsername(username)

		if (!user) {
			throw new NotFoundException("This user doesn't exists")
		}

		return user
	}

	@ApiOperation({ summary: 'return one user by id' })
	@ApiParam({
		type: 'number',
		name: 'id',
		example: 1,
	})
	@ApiResponse({
		status: 200,
		description: 'user',
		type: FindUserDto,
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiNotFoundResponse({ description: "This user doesn't exists" })
	@ApiBearerAuth()
	@UseGuards(AuthGuard('jwt'), UserIsAdmin)
	@Get(':id')
	async findOneById(@Param('id') id: number): Promise<UserEntity> {
		const user = await this.userService.findOneById(id)

		if (!user) {
			throw new NotFoundException("This user doesn't exists")
		}

		return user
	}

	@ApiOperation({ summary: 'update a user' })
	@ApiParam({
		type: 'string',
		name: 'id',
		example: 1,
	})
	@ApiResponse({
		status: 200,
		description: 'user',
		type: FindUserDto,
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiNotFoundResponse({ description: "This user doesn't exists" })
	@ApiBearerAuth()
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
