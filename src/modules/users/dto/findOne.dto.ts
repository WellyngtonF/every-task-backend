import {
	IsNotEmpty,
	MinLength,
	IsEmail,
	IsBooleanString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindUserDto {
	@ApiProperty({ example: 1 })
	readonly id: number

	@ApiProperty({ example: 'Wellyngton' })
	@IsNotEmpty()
	readonly name: string

	@ApiProperty({ example: 'wellyngton@email.com' })
	@IsNotEmpty()
	@IsEmail()
	readonly email: string

	@ApiProperty({
		example: '$2b$10$9YdgjPvCelJpNXgC5jzGMuNSyJeuiMm/hzsJSP/yz/W1l08B3X0Xi',
	})
	@IsNotEmpty()
	@MinLength(6)
	readonly password: string

	@ApiProperty({ example: true })
	@IsNotEmpty()
	@IsBooleanString()
	readonly admin: boolean

	@ApiProperty({ example: '2021-10-18T19:35:39.502Z' })
	readonly createdAt: Date

	@ApiProperty({ example: '2021-10-18T19:35:39.502Z' })
	readonly updatedAt: Date
}
