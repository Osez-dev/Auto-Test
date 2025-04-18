import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class UpdateReviewDto {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    submittedFor?: User;

    @IsOptional()
    submittedBy?: User;

}
