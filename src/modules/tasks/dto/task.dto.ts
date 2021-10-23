import { IsNotEmpty, MinLength, IsDate, IsOptional } from 'class-validator'

export class TaskDto {
	@IsNotEmpty()
	@MinLength(6)
	readonly description: string

	@IsOptional()
	@IsDate()
	readonly dateEstimated: Date

	@IsOptional()
	@IsDate()
	readonly dateClosed: Date
}
