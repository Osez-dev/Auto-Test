import { 
    IsString, 
    IsNotEmpty, 
    IsNumber, 
    IsOptional, 
    IsArray, 
    ValidateNested,
    IsBoolean
  } from 'class-validator';
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
  
  export class CreateListingDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    condition: string;
  
    @IsString()
    @IsNotEmpty()
    regno: string;
  
    @IsString()
    @IsNotEmpty()
    make: string;
  
    @IsString()
    @IsNotEmpty()
    model: string;
  
    @IsNumber()
    @IsNotEmpty()
    yearofmanufacture: number;
  
    @IsNumber()
    @IsNotEmpty()
    mileage: number;
  
    @IsString()
    @IsNotEmpty()
    fuelType: string;
  
    @IsString()
    @IsNotEmpty()
    bodyType: string;
  
    @IsString()
    @IsNotEmpty()
    transmission: string;
  
    @IsString()
    @IsNotEmpty()
    district: string;
  
    @IsString()
    @IsNotEmpty()
    city: string;
  
    @IsNumber()
    @IsNotEmpty()
    engineCc: number;
  
    @IsNumber()
    @IsNotEmpty()
    price: number;
  
    @IsString()
    @IsOptional()
    sellersNotes?: string;
  
    @IsString()
    @IsNotEmpty()
    status: string;
  
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsOptional()
    userRole: string;
  
    @IsOptional()
    @IsString()
    grade?: string;
  
    @IsOptional()
    @IsString()
    exteriorColor?: string;
  
    @IsOptional()
    @IsString()
    interiorColor?: string;
  
    @IsNumber()
    @IsOptional()
    noOfOwners?: number;
  
    @IsString()
    @IsOptional()
    blueTGrade?: string;
  
    @IsOptional()
    @IsBoolean()
    isBlueTVerified?: boolean;
  
    @IsNumber()
    @IsOptional()
    yearOfReg?: number;
  
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    imageUrls?: string[];

    @IsOptional()
    @IsString()
    registrationImageUrl?: string;

    @IsOptional()
    @IsString()
    verificationDocument?: string;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => ListingFeaturesDto)
    listingFeatures?: ListingFeaturesDto;
  }
  