import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../products.service';
import { Products } from 'src/models/products/entities/product.entity';
import { CreateProductDto } from '../dto/create.product.dto';
import { Users, UserType } from 'src/models/users/entities/user.entities';
import { HttpException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepo: jest.Mocked<Repository<Products>>;
  let userRepo: jest.Mocked<Repository<Users>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepo = module.get(getRepositoryToken(Products));
    userRepo = module.get(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new product when owner is valid', async () => {
    const dto: CreateProductDto = {
      name: 'Produk A',
      description: 'Deskripsi produk',
      stock: 5,
      price: 10000,
      ownerId: 1,
    };

    const mockOwner = {
      id: 1,
      name: 'Owner Satu',
      type_user: UserType.OWNER,
    } as Users;

    const mockProduct = {
      id: 1,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      owner: mockOwner,
    } as Products;

    userRepo.findOne.mockResolvedValue(mockOwner);
    productRepo.create.mockReturnValue(mockProduct);
    productRepo.save.mockResolvedValue(mockProduct);

    const result = await service.create(dto);

    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { id: dto.ownerId },
    });

    expect(productRepo.create).toHaveBeenCalledWith({
      ...dto,
      owner: mockOwner,
    });

    expect(productRepo.save).toHaveBeenCalledWith(mockProduct);
    expect(result).toEqual(mockProduct);
  });

  it('should throw 404 if owner not found', async () => {
    const dto: CreateProductDto = {
      name: 'Produk A',
      description: 'Deskripsi produk',
      stock: 5,
      price: 10000,
      ownerId: 99,
    };

    userRepo.findOne.mockResolvedValue(null);

    try {
      await service.create(dto);
      fail('Expected service.create to throw 404');
    } catch (err: unknown) {
      const error = err as HttpException;

      expect(error.getStatus()).toBe(404);
      expect(error.getResponse()).toMatchObject({
        status: false,
        message: expect.stringContaining('tidak ditemukan'),
      });
    }
  });

  it('should throw 403 if owner is not type OWNER', async () => {
    const dto: CreateProductDto = {
      name: 'Produk A',
      description: 'Deskripsi produk',
      stock: 5,
      price: 10000,
      ownerId: 2,
    };

    const mockUser = {
      id: 2,
      name: 'Bukan Owner',
      type_user: UserType.CUSTOMER,
    } as Users;

    userRepo.findOne.mockResolvedValue(mockUser);

    try {
      await service.create(dto);
      fail('Expected service.create to throw 403');
    } catch (err: unknown) {
      const error = err as HttpException;

      expect(error.getStatus()).toBe(403);
      expect(error.getResponse()).toMatchObject({
        status: false,
        message: expect.stringContaining('Hanya user dengan tipe owner'),
      });
    }
  });
});
