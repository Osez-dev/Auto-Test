import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Listing } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UsersService } from '../users/users.service';
import { UpdateListingDto } from './dto/updatelisting.dto';
import { SearchListingsDto } from './dto/search-listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingsRepository: Repository<Listing>,
    private readonly usersService: UsersService,
  ) { }

  // Create a new listing
  async create(createListingDto: CreateListingDto): Promise<Listing> {
    const user = await this.usersService.findOne(createListingDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const listing = this.listingsRepository.create({
      ...createListingDto,
      user, // Assign user relation
      userId: user.id, // Explicitly save userId
      userRole: user.role // Save the user's role
    });
    return this.listingsRepository.save(listing);
  }

  // Fetch all listings
  async findAll(): Promise<Listing[]> {
    return this.listingsRepository.find({
      relations: ['user'], // Include user relation
    });
  }

  // Fetch a single listing by ID
  async findOne(id: number): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ['user'], // Include user relation
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    listing.views += 1;
    await this.listingsRepository.save(listing);

    return listing;
  }

  // Update a listing
  async update(id: number, updateListingDto: UpdateListingDto): Promise<Listing> {
    try {
      const listing = await this.findOne(id);

      if (!listing) {
        throw new NotFoundException(`Listing with ID ${id} not found`);
      }

      // Update fields
      Object.assign(listing, updateListingDto);

      // Save the updated listing
      return await this.listingsRepository.save(listing);
    } catch (error) {
      console.error('Error updating listing:', error.message);
      throw new InternalServerErrorException('Failed to update listing');
    }
  }

  // Remove a listing
  async remove(id: number): Promise<void> {
    const listing = await this.findOne(id);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    await this.listingsRepository.remove(listing);
  }

  // Partial Update
  async partialUpdate(id: number, updateListingDto: UpdateListingDto): Promise<Listing> {
    const listing = await this.findOne(id);
    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    // Merge the existing listing with the provided updates
    const updatedListing = Object.assign(listing, updateListingDto);

    try {
      return await this.listingsRepository.save(updatedListing);
    } catch (error) {
      console.error('Error partially updating listing:', error.message);
      throw new InternalServerErrorException('Failed to partially update listing');
    }
  }

  async findByUserId(userId: number): Promise<Listing[]> {
    return this.listingsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'], // Include user relation
    });
  }

  /**
   * Finds and returns a list of listings based on the provided search criteria.
   * 
   * @param {SearchListingsDto} dto - The search criteria for filtering listings.
   * @returns {Promise<Listing[]>} - A promise that resolves to an array of listings that match the search criteria.
   * 
   * The search criteria can include:
   * - Simple key-value pairs for exact matches.
   * - Arrays for matching any value within the array.
   * - A 'search' key for partial matches in the title or description.
   * - Objects with 'min' and 'max' properties for range filters.
   * 
   * Example usage:
   * ```typescript
   * const searchCriteria: SearchListingsDto = {
   *   title: 'House',
   *   price: { min: 100000, max: 500000 },
   *   tags: ['garden', 'garage'],
   *   search: 'spacious'
   * };
   * const listings = await listingsService.findMany(searchCriteria);
   * ```
   */
  async findMany(dto: SearchListingsDto): Promise<Listing[]> {
    const query = this.listingsRepository.createQueryBuilder('listing');

    // Apply filters dynamically
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          // Handle array values 
          query.andWhere(`listing.${key} IN (:...${key})`, { [key]: value });

        } else if (typeof value === 'string' && key === 'search') {
          // Handle search filter (title or description LIKE %value%)
          query.andWhere(
            'listing.title LIKE :search OR listing.description LIKE :search',
            { search: `%${value}%` }
          );

        } else if (typeof value === 'object' && !Array.isArray(value)) {
          // Ensure it's an object and not an array
          if ('min' in value && 'max' in value && value.min !== undefined && value.max !== undefined) {
            // Handle range filters (e.g., price between min and max)
            query.andWhere(`listing.${key} BETWEEN :min AND :max`, { min: value.min, max: value.max });
          }
        } else {
          query.andWhere(`listing.${key} = :${key}`, { [key]: value });
        }
      }
    });

    return await query.getMany();
  }
}