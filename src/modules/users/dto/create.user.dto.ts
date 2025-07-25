import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/models/users/entities/user.entities';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  type_user: UserType;
}
