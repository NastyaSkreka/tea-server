import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class AuthDto { 
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { 
        message: 'Password must be at least 6 characters long'
     })
    password: string;
  
    @IsOptional()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    avatarPath?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsString()
    role?: string;
}