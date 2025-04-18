import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchListingsDto {
    @IsOptional()
    @Transform(({ value }) => value.split(',').map((item: string) => item.trim()))  
    @IsString({ each: true })
    make?: string[];

    @IsOptional()
    @Transform(({ value }) => value.split(',').map((item: string) => item.trim()))  
    @IsString({ each: true })
    model?: string[];

    @IsOptional()
    @Transform(({ value }) => value.split(',').map((item: string) => item.trim()))  
    @IsString({ each: true })
    bodyType?: string[];

    @IsOptional()
    @Transform(({ value }) => (value ? Number(value) : undefined))    
    @IsNumber()
    minPrice?: number;
  
    @IsOptional()
    @Transform(({ value }) => (value ? Number(value) : undefined))
    @IsNumber()
    maxPrice?: number;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    transmission?: string;

    @IsOptional()
    @IsString()
    fuelType?: string;

    @IsOptional()
    @IsString()
    condition?: string;

    @IsOptional()
    @IsString()
    yearofmanufacture?: string;

    @IsOptional()
    @IsString()
    search?: string;

    // @IsOptional()
    // year: number;
}

