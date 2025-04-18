// src/spare-parts/dto/create-spare-part.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateSparePartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  keywords: string[];

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];
}
