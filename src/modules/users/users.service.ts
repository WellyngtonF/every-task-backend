import { Injectable, Inject, Body } from '@nestjs/common'
import { User } from './user.entity'
import { UserDto } from './dto/user.dto'
import { USER_REPOSITORY } from '../../core/constants'

@Injectable()
export class UsersService {
	constructor(@Inject(USER_REPOSITORY) private readonly userRepository) {}

	async create(@Body() user: UserDto): Promise<User> {
		return await this.userRepository.create(user)
	}

	async findOneByEmail(email: string): Promise<User> {
		return await this.userRepository.findOne({ where: { email } })
	}

	async findOneByUsername(name: string): Promise<User> {
		return await this.userRepository.findOne({ where: { name } })
	}

	async findOneById(id: number): Promise<User> {
		return await this.userRepository.findOne({ where: { id } })
	}
}
