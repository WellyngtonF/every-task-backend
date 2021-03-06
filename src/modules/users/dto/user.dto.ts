import {
	IsNotEmpty,
	MinLength,
	IsEmail,
	IsBooleanString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
	@ApiProperty({ example: 'Wellyngton' })
	@IsNotEmpty()
	readonly name: string

	@ApiProperty({ example: 'wellyngton@email.com' })
	@IsNotEmpty()
	@IsEmail()
	readonly email: string

	@ApiProperty({
		example: '123456',
	})
	@IsNotEmpty()
	@MinLength(6)
	readonly password: string

	@ApiProperty({ example: true })
	@IsNotEmpty()
	@IsBooleanString()
	readonly admin: boolean
}
