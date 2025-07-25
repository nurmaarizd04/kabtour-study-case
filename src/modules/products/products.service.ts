import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/models/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create.product.dto';
import { Users, UserType } from 'src/models/users/entities/user.entities';
import { UpdateProductDto } from './dto/update.product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productRepository: Repository<Products>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  findAll() {
    return this.productRepository.find({ relations: ['owner'] });
  }

  findOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async create(data: CreateProductDto) {
    let owner: Users | null = null;

    if (data.ownerId) {
      owner = await this.userRepository.findOne({
        where: { id: data.ownerId },
      });

      if (!owner) {
        throw new HttpException(
          {
            status: false,
            message: `User dengan id tidak ditemukan`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // ✅ Validasi: hanya OWNER yang bisa membuat produk
      if (owner.type_user !== UserType.OWNER) {
        throw new HttpException(
          {
            status: false,
            message: `Hanya user dengan tipe owner yang dapat membuat produk`,
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    const product = this.productRepository.create({
      ...data,
      ...(owner ? { owner } : {}),
    });

    return this.productRepository.save(product);
  }

  async update(id: number, data: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new HttpException(
        {
          status: false,
          message: `Id product tidak ditemukan!`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Update data
    if (data.name !== undefined) product.name = data.name;
    if (data.stock !== undefined) product.stock = data.stock;

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);

    if (product) {
      return this.productRepository.remove(product);
    }
    return null;
  }
}
