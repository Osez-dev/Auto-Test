import { IsString, IsNumber, IsEmail, IsDateString } from 'class-validator';

export class CreateTestDriveDto {
  listingId: number;
  userId: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsDateString()
  time: string; // ISO 8601 date string
}
