import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { UsersService } from '../../modules/users/users.service'

@Injectable()
export class UserIsAdmin implements CanActivate {
	constructor(private readonly userService: UsersService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()
		return this.validateRequest(request)
	}

	async validateRequest(request) {
		if (!request.user.admin) {
			throw new UnauthorizedException(
				'You are not authorized to perform the operation',
			)
		}
		return true
	}
}
