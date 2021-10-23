import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript'
import { User } from '../users/user.entity'

@Table
export class Task extends Model<Task> {
	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	userId: number

	@Column({
		type: DataType.STRING(100),
		allowNull: false,
	})
	description: string

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	})
	isClosed: boolean

	@Column({
		type: DataType.DATE,
	})
	dateEstimated: Date

	@Column({
		type: DataType.DATE,
	})
	dateClosed: Date

	@BelongsTo(() => User)
	user: User
}
