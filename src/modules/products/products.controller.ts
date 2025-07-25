import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Put,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from 'src/models/products/entities/product.entity';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<{
    data: Products[];
    status: boolean;
  }> {
    const data = await this.productsService.findAll();

    return {
      status: true,
      data: data.length ? data : [], // kalau kosong tetap []
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const productId = await this.productsService.findOne(+id);

    if (!productId) {
      throw new NotFoundException({
        status: false,
        message: 'Id product not fount',
      });
    }

    return {
      status: true,
      data: productId,
    };
  }

  @Post()
  async create(@Body(new ValidationPipe()) body: CreateProductDto) {
    const createProduct = await this.productsService.create(body);

    return {
      status: true,
      message: 'Data products berhasil dibuat',
      data: createProduct,
    };
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    const updateProduct = await this.productsService.update(id, data);

    return {
      status: true,
      message: 'Data products berhasil diupdate',
      data: updateProduct,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const deleted = await this.productsService.remove(+id);

    if (!deleted) {
      throw new NotFoundException({
        status: false,
        message: 'Id product not fount',
      });
    }

    return {
      message: 'Data derhasil di hapus',
      status: true,
      data: deleted,
    };
  }
}
