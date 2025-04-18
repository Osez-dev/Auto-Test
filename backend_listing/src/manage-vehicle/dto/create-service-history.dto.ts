import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceHistoryDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  serviceType: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  cost: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  mileage: number;

  @IsNotEmpty()
  @IsDateString()
  nextServiceDue: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  vehicleId: number;
} 