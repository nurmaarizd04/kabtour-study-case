import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users, UserType } from 'src/models/users/entities/user.entities';
import { Products } from 'src/models/products/entities/product.entity';
import { Transactions } from 'src/models/transactions/entities/Transaction.entities';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-status.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionRepo: Repository<Transactions>,

    @InjectRepository(Users)
    private userRepo: Repository<Users>,

    @InjectRepository(Products)
    private productRepo: Repository<Products>,
  ) {}

  async create(data: CreateTransactionDto) {
    const customer = await this.userRepo.findOne({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new HttpException(
        {
          status: false,
          message: 'User id tidak ditemukan!',
          response: 'Transaksi tidak bisa dilanjutkan!',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (customer.type_user !== UserType.CUSTOMER) {
      throw new HttpException(
        {
          status: false,
          message:
            'Transaksi hanya bisa dilakukan oleh user dengan tipe customer',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const product = await this.productRepo.findOne({
      where: { id: data.productId },
      relations: ['owner'],
    });
    if (!product) {
      throw new HttpException(
        {
          status: false,
          message: 'Product id tidak ditemukan!',
          response: 'Transaksi tidak bisa dilanjutkan!',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // cek stock
    if (product.stock === 0 || data.quantity > product.stock) {
      throw new HttpException(
        {
          status: false,
          message: `Stok tidak mencukupi! Stok tersedia hanya ${product.stock}, tetapi Anda meminta ${data.quantity}. Silahkan cari produk lain`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const totalPrice = product.price * data.quantity;

    const trx = this.transactionRepo.create({
      customer,
      product,
      quantity: data.quantity,
      totalPrice,
    });

    await this.transactionRepo.save(trx);

    // kurangin stock product berdasarkan product yg dipilih
    await this.productRepo.decrement(
      { id: product.id },
      'stock',
      data.quantity,
    );

    const result_response_trx = {
      customer_name: customer.name,
      owner: product.owner.name,
      status: trx.status,
      customer,
      product,
      quantity: data.quantity,
      totalPrice,
    };

    return result_response_trx;
  }

  // src/modules/transactions/transactions.service.ts
  async updateStatus(id: number, dto: UpdateTransactionStatusDto) {
    const trx = await this.transactionRepo.findOne({ where: { id } });

    if (!trx) {
      throw new HttpException(
        {
          status: false,
          message: 'Transaksi tidak ditemukan',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    trx.status = dto.status;

    const updated = await this.transactionRepo.save(trx);

    return {
      status: true,
      message: 'Status transaksi berhasil diperbarui',
      data: updated,
    };
  }

  findAll() {
    return this.transactionRepo.find({
      relations: ['customer', 'product'],
    });
  }

  findOne(id: number) {
    return this.transactionRepo.findOne({
      where: { id },
      relations: ['customer', 'product'],
    });
  }

  async remove(id: number) {
    const trx = await this.findOne(id);
    if (!trx) {
      throw new NotFoundException(`Transaksi dengan id ${id} tidak ditemukan`);
    }
    return this.transactionRepo.remove(trx);
  }
}
