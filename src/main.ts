import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { Logger, LoggerService } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  const logger: LoggerService = new Logger();

  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('dev'));
  app.setGlobalPrefix('api');

  await app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
  });
}
bootstrap();
