import { Controller, Body, Post, UseGuards } from '@nestjs/common'
import {
	ApiOperation,
	ApiResponse,
	ApiForbiddenResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { UserDto } from '../users/dto/user.dto'
import { LoginDto } from './dto/login.dto'
import { DoesUserExist } from '../../core/guards/doesUserExist.guard'
import { LoginResponseDto } from './dto/loginResponse.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: 'login' })
	@ApiResponse({
		status: 201,
		description: 'user logged',
		type: LoginResponseDto,
	})
	@ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(@Body() login: LoginDto) {
		return await this.authService.login(login.username) // username as email
	}

	@ApiOperation({ summary: 'signup' })
	@ApiResponse({
		status: 201,
		description: 'user created',
		schema: {
			type: 'object',
			properties: {
				user: {
					properties: {
						id: {
							type: 'number',
							example: 1,
						},
						name: {
							type: 'string',
							example: 'swagger user',
						},
						email: {
							type: 'string',
							example: 'swagger@email.com',
						},
						password: {
							type: 'string',
							example:
								'$2b$10$f5JgRGBithxNXnBSLIgpmOM23Yb/Gm3M7AmUa5uP4rrL/1RkgVz0i',
						},
						admin: {
							type: 'boolean',
							example: false,
						},
						createdAt: {
							type: 'datetime',
							example: '2021-10-18 19:35:39.502-03Z',
						},
						updatedAt: {
							type: 'datetime',
							example: '2021-10-18 19:35:39.502-03Z',
						},
					},
				},
				token: {
					type: 'string',
					example:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6InN3YWdnZXIgdXNlciIsImVtYWlsIjoic3dhZ2dlckBlbWFpbC5jb20iLCJhZG1pbiI6ZmFsc2UsInVwZGF0ZWRBdCI6IjIwMjEtMTAtMzFUMTU6Mzg6MDEuNjcyWiIsImNyZWF0ZWRBdCI6IjIwMjEtMTAtMzFUMTU6Mzg6MDEuNjcyWiIsImlhdCI6MTYzNTcwNTQ4MSwiZXhwIjoxNjM1ODc4MjgxfQ.hKZCc9mpu7Ut8RCJvJaBTwex43gtb-60ts8Q0xcPrAk',
				},
			},
		},
	})
	@ApiForbiddenResponse({ description: 'This email already exist' })
	@UseGuards(DoesUserExist)
	@Post('signup')
	async signUp(@Body() user: UserDto) {
		return await this.authService.create(user)
	}
}
