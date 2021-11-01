import {
	IsNotEmpty,
	MinLength,
	IsOptional,
	IsDate,
	IsBooleanString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindTaskDto {
	@ApiProperty({ example: 1 })
	readonly id: number

	@ApiProperty({ example: 'example of task' })
	@IsNotEmpty()
	@MinLength(6)
	readonly description: string

	@ApiProperty({ example: false })
	@IsBooleanString()
	readonly isClosed: boolean

	@ApiProperty({ required: false, example: null })
	@IsOptional()
	@IsDate()
	readonly dateEstimated?: Date

	@ApiProperty({ required: false, example: null })
	@IsOptional()
	@IsDate()
	readonly dateClosed?: Date

	@ApiProperty({ example: '2021-10-18T19:35:39.502Z' })
	readonly createdAt: Date

	@ApiProperty({ example: '2021-10-18T19:35:39.502Z' })
	readonly updatedAt: Date
}
