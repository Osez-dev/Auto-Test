import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateLeasingCompanyDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  interestRate: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(360)
  termInMonths: number;
} 