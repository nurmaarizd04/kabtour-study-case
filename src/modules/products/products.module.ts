// src/modules/users/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Products } from 'src/models/products/entities/product.entity';
import { Users } from 'src/models/users/entities/user.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Users])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
