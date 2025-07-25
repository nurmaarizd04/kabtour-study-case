import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { TransactionStatus } from 'src/models/transactions/entities/Transaction.entities';

export class UpdateTransactionStatusDto {
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
