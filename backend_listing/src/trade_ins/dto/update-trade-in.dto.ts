import { PartialType } from '@nestjs/mapped-types';
import { CreateTradeInDto } from './create-trade-in.dto';
import { IsOptional, IsString, IsNumber, IsBoolean, IsEmail, IsArray, IsUrl } from 'class-validator';

export class UpdateTradeInDto extends PartialType(CreateTradeInDto) {
  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsOptional()
  @IsNumber()
  mileage?: number;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  carPhotos?: string[];

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  exteriorColor?: string;

  @IsOptional()
  @IsString()
  interiorColor?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  exteriorCondition?: string;

  @IsOptional()
  @IsString()
  interiorCondition?: string;

  @IsOptional()
  @IsBoolean()
  vehicleBeenInAccident?: boolean;

  @IsOptional()
  @IsNumber()
  userId?: number;

  // Contact Information
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  emailAddress?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
