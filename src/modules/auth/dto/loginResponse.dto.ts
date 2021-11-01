import { IsNotEmpty, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
	@ApiProperty({ example: 'wellyngton61@gmail.com' })
	@IsNotEmpty()
	@IsEmail()
	readonly username: string

	@ApiProperty({ example: 'fiofw3r324o0mtrgbm3214856' })
	@IsNotEmpty()
	readonly token: string
}
