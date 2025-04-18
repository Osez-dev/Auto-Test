import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import * as bcrypt from 'bcrypt';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  role?: string; // Optional, default will be 'customer'

  @IsOptional()
  emailVerificationToken?: string;

  @IsOptional()
  emailVerificationExpires?: Date;

  @IsOptional()
  isEmailVerified?: boolean;

  @IsString()
  @IsOptional()
  facebookId?: string;

  // Add a method to create partial user
  static createSocialUser(data: Partial<CreateUserDto>): CreateUserDto {
    const dto = new CreateUserDto();
    dto.email = data.email || '';
    dto.firstName = data.firstName || '';
    dto.lastName = data.lastName || '';
    dto.phoneNumber = data.phoneNumber || ''; // Default empty string
    dto.password = data.password || '';
    dto.role = data.role || 'customer';
    dto.facebookId = data.facebookId;
    return dto;
  }
}

