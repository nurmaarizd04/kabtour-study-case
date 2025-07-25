import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from 'src/models/transactions/entities/Transaction.entities';
import { Users } from 'src/models/users/entities/user.entities';
import { Products } from 'src/models/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions, Users, Products])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
