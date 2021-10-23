import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidateInputPipe } from './core/pipes/validade.pipe'
import { setTimeZone } from './core/functions/setTimeZone'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	// global endpoint prefix
	app.setGlobalPrefix('api/')
	// handle all user input validation globally
	app.useGlobalPipes(new ValidateInputPipe())
	setTimeZone() // prevents the pg change the timezone
	await app.listen(3000)
}

bootstrap()
