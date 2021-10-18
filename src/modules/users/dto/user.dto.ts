import { IsNotEmpty, MinLength, IsEmail, IsBoolean } from 'class-validator'
export class UserDto {
	@IsNotEmpty()
	readonly name: string

	@IsNotEmpty()
	@IsEmail()
	readonly email: string

	@IsNotEmpty()
	@MinLength(6)
	readonly password: string

	@IsNotEmpty()
	@IsBoolean()
	readonly admin: boolean
}
