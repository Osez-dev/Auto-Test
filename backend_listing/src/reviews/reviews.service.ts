import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '../users/entities/user.entity';
import { Review } from './entities/reviews.entitiy';
import { CreateReviewDto } from './dto/create-reviews.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,

        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    // Create a new review
    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        // Find the users based on the provided IDs
        const submittedFor = await this.userRepository.findOne({
            where: { id: createReviewDto.receivedUserId },
            select: ['id'],
        });

        const submittedBy = await this.userRepository.findOne({
            where: { id: createReviewDto.submittedUserId },
            select: ['id'],
        });

        if (!submittedFor) {
            throw new NotFoundException('User for whom the review is submitted not found');
        }

        if (!submittedBy) {
            throw new NotFoundException('User submitting the review not found');
        }

        // Create the review entity
        const review = this.reviewRepository.create({
            title: createReviewDto.title,
            description: createReviewDto.description,
            rating: createReviewDto.rating,
            submittedFor,
            submittedBy,
        });

        // Save the review
        const savedReview = await this.reviewRepository.save(review);
        return savedReview;
    }

    // Find a review by its ID
    async findOne(id: number): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ['submittedFor', 'submittedBy'], // Include relationships to users
        });

        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }

        return review;
    }

    // Find all reviews
    async findAll(): Promise<Review[]> {
        return this.reviewRepository.find({
            relations: ['submittedFor', 'submittedBy'], // Include relationships to users
        });
    }

    // Update a review
    async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
        // Find the review first
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ['submittedFor', 'submittedBy'],
        });

        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }

        // Find the users again if IDs are provided in the DTO
        if (updateReviewDto.submittedFor) {
            const submittedFor = await this.userRepository.findOne({
                where: { id: typeof updateReviewDto.submittedFor === 'object' ? updateReviewDto.submittedFor.id : updateReviewDto.submittedFor },
            });

            if (!submittedFor) {
                throw new NotFoundException('User for whom the review is being updated not found');
            }
            review.submittedFor = submittedFor;
        }

        if (updateReviewDto.submittedBy) {
            const submittedBy = await this.userRepository.findOne({
                where: { id: typeof updateReviewDto.submittedBy === 'object' ? updateReviewDto.submittedBy.id : updateReviewDto.submittedBy },
            });

            if (!submittedBy) {
                throw new NotFoundException('User submitting the review is not found');
            }
            review.submittedBy = submittedBy;
        }

        // Update the other fields
        if (updateReviewDto.title) review.title = updateReviewDto.title;
        if (updateReviewDto.description) review.description = updateReviewDto.description;
        if (updateReviewDto.rating) review.rating = updateReviewDto.rating;

        // Save the updated review
        return this.reviewRepository.save(review);
    }

    // Delete a review
    async remove(id: number): Promise<void> {
        const review = await this.reviewRepository.findOne({ where: { id } });

        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }

        await this.reviewRepository.remove(review);
    }
}
