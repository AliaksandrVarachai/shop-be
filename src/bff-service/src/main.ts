import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {recipientUrl} from './app.middleware';

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(recipientUrl);
  await app.listen(PORT);
}
bootstrap();
