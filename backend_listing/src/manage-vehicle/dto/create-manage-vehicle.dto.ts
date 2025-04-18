import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateManageVehicleDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsEnum(['owned', 'leased', 'financed'])
  @IsNotEmpty()
  ownershipStatus: string;

  @IsEnum(['excellent', 'good', 'fair'])
  @IsNotEmpty()
  condition: string;

  @IsNumber()
  @IsNotEmpty()
  currentMileage: number;
} 