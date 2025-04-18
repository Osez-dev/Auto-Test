import { PartialType } from '@nestjs/mapped-types';
import { CreateTestDriveDto } from './create-test-drive.dto';
import { IsOptional, IsString, IsEmail, IsDateString } from 'class-validator';

export class UpdateTestDriveDto extends PartialType(CreateTestDriveDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  time?: string;
}
