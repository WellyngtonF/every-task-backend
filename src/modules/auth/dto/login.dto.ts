import { IsNotEmpty, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
	@ApiProperty({ example: 'wellyngton61@gmail.com' })
	@IsNotEmpty()
	@IsEmail()
	readonly username: string

	@ApiProperty({ example: '123456' })
	@IsNotEmpty()
	readonly password: string
}
