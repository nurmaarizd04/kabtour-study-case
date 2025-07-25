import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupValidationPipeResponse } from './common/setupValidationPipeResponse';
import { userSeeder } from './seeder/user.seeder';
import { DataSource } from 'typeorm';
import { productSeeder } from './seeder/product.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(setupValidationPipeResponse());

  // dummy data seeder
  const dataSource = app.get(DataSource);
  await userSeeder(dataSource);
  await productSeeder(dataSource);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
