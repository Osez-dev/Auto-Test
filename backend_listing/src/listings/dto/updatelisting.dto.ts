import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { IsOptional, IsString, IsArray, ValidateNested, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';


class ListingFeaturesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  convenience?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  infotainment?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  safetyAndSecurity?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interiorAndSeats?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  windowsAndLighting?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  otherFeatures?: string[];
}

export class UpdateListingDto extends PartialType(CreateListingDto) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isSold?: boolean;

  @IsString()
    condition: string;
  
    @IsString()
    regno: string;
  
    @IsString()
    make: string;
  
    @IsString()
    model: string;
  
    @IsNumber()
    yearofmanufacture: number;
  
    @IsNumber()
    mileage: number;
  
    @IsString()
    fuelType: string;
  
    @IsString()
    bodyType: string;
  
    @IsString()
    transmission: string;
  
    @IsString()
    district: string;
  
    @IsString()
    city: string;
  
    @IsNumber()
    engineCc: number;
  
    @IsNumber()
    price: number;
  
    @IsString()
    @IsOptional()
    sellersNotes?: string;
  
    @IsString()
    status: string;
  
    @IsNumber()
    userId: number;
  
    @IsOptional()
    @IsString()
    grade?: string;
  
    @IsOptional()
    @IsString()
    exteriorColor?: string;
  
    @IsOptional()
    @IsString()
    interiorColor?: string;
  
    @IsOptional()
    @IsNumber()
    noOfOwners?: number;
  
    @IsOptional()
    @IsString()
    blueTGrade?: string;
  
    @IsOptional()
    @IsBoolean()
    isBlueTVerified?: boolean;
  
    @IsOptional()
    @IsNumber()
    yearOfReg?: number;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ListingFeaturesDto)
  listingFeaturesDto?: ListingFeaturesDto;
}
