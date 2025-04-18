// src/reviews/dto/create-review.dto.ts
import { IsInt, IsString, Max, Min } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateReviewDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  submittedUserId: number;

  @IsInt()
  receivedUserId: number;
}
