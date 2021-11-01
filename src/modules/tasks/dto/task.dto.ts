import { IsNotEmpty, MinLength, IsDate, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class TaskDto {
	@ApiProperty({ example: 'example task' })
	@IsNotEmpty()
	@MinLength(6)
	readonly description: string

	@ApiProperty({ required: false })
	@IsOptional()
	@IsDate()
	readonly dateEstimated?: Date

	@ApiProperty({ required: false })
	@IsOptional()
	@IsDate()
	readonly dateClosed?: Date
}
