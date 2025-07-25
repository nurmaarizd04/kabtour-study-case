import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from 'src/models/users/entities/user.entities';
import { CreateUserDto } from './dto/create.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<{ status: boolean; data: Users[] }> {
    const dataUser = await this.usersService.findAll();

    return {
      status: true,
      data: dataUser,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const idUser = await this.usersService.findOne(+id);

    if (!idUser) {
      throw new NotFoundException({
        status: false,
        message: 'User not found',
        error: 'Not Found',
      });
    }

    return {
      status: true,
      data: idUser,
    };
  }

  @Post()
  async create(@Body(new ValidationPipe()) body: CreateUserDto) {
    const createdUser = await this.usersService.create(body);

    return {
      status: true,
      message: 'Data user berhasil dibuat',
      data: createdUser,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const deleted = await this.usersService.remove(+id);

    if (!deleted) {
      throw new NotFoundException({
        status: false,
        message: 'User not found',
        error: 'Not Found',
      });
    }

    return {
      message: 'Data derhasil di hapus',
      status: true,
      data: deleted,
    };
  }
}
