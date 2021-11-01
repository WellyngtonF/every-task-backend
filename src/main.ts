import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidateInputPipe } from './core/pipes/validade.pipe'
import { setTimeZone } from './core/functions/setTimeZone'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	// global endpoint prefix
	app.setGlobalPrefix('api/')
	// handle all user input validation globally
	app.useGlobalPipes(new ValidateInputPipe())
	// swagger config, disable this in production
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Every Task')
		.setDescription('Every Task API description')
		.setVersion('1.0')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('swaggerdocument', app, document, {
		swaggerOptions: {
			docExpansion: 'list',
			DefaultModelsExpandDepth: 0,
			DefaultModelExpandDepth: 0,
			persistAuthorization: true,
		},
	})
	setTimeZone() // prevents the pg change the timezone
	await app.listen(3000)
}

bootstrap()
