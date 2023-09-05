import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {LoggingInterceptor} from "./common/interceptors/logging.interceptor";
import {TransformInterceptor} from "./common/interceptors/transform.interceptor";
import {ErrorsInterceptor} from "./common/interceptors/errors.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(
      new LoggingInterceptor(),
      new TransformInterceptor(),
      new ErrorsInterceptor()
  )
  await app.listen(process.env.NEST_PORT);
}
bootstrap();
