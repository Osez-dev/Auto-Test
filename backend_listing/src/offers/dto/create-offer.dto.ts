import { IsNumber, IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  listingId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  offerPrice: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  status: string; // Default to 'pending' if not provided
}
