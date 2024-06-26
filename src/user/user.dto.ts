import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../utils/constants';

export class UserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatarPath: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  // @IsString()
  @IsEnum(Role)
  role?: Role;
}
