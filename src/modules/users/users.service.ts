import { Injectable, Inject, Body } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
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

	async findAllUsers(): Promise<User[]> {
		return await this.userRepository.findAll()
	}

	async update(id, data) {
		const pass = await this.hashPassword(data.password)
		const [numberOfAffectedRows, [updatedUser]] =
			await this.userRepository.update(
				{ ...data, password: pass },
				{ where: { id }, returning: true },
			)

		return { numberOfAffectedRows, updatedUser }
	}

	public async hashPassword(password) {
		const hash = await bcrypt.hash(password, 10)
		return hash
	}
}
