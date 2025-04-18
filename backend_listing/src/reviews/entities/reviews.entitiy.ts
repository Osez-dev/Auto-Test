import { IsInt, Max, Min } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    submittedFor: User; // User for whom the review is submitted

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    submittedBy: User; // User submitting the review
}