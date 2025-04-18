import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';
import { IsOptional, IsString, IsNumber, IsEmail } from 'class-validator';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  @IsOptional()
  @IsNumber()
  offerPrice?: number;

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
  @IsString()
  status?: string;
}
