import { IsString, IsNumber, IsBoolean, IsOptional, IsEmail, IsArray, IsUrl } from 'class-validator';

export class CreateTradeInDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsString()
  transmission: string;

  @IsNumber()
  mileage: number;

  @IsString()
  vin: string;

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

  @IsNumber()
  userId: number;

  // Contact Information
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  emailAddress: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  comments: string;
}
