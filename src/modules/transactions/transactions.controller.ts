import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { Transactions } from 'src/models/transactions/entities/Transaction.entities';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const dataTransaksi =
      await this.transactionsService.create(createTransactionDto);

    return {
      status: true,
      message: 'Suksess',
      data: dataTransaksi,
    };
  }

  @Get()
  async findAll(): Promise<{
    status: boolean;
    data: Transactions[];
  }> {
    const dataTransactions = await this.transactionsService.findAll();

    return {
      status: true,
      data: dataTransactions.length ? dataTransactions : [],
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const dataTransactionsId = await this.transactionsService.findOne(id);

    if (!dataTransactionsId) {
      throw new NotFoundException({
        status: false,
        message: 'data transaksi tidak ditemukan!',
      });
    }

    return {
      status: true,
      data: dataTransactionsId,
    };
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.remove(id);
  }
}
