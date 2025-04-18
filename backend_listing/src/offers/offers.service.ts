import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ListingsService } from '../listings/listings.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private listingsService: ListingsService,
    private usersService: UsersService,
  ) {}
  
  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const listing = await this.listingsService.findOne(createOfferDto.listingId);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const user = await this.usersService.findOne(createOfferDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const offer = this.offersRepository.create({
      ...createOfferDto,
      listing,
      user,
      status: createOfferDto.status || 'pending',
    });
    return this.offersRepository.save(offer);
  }
  
  findAll(): Promise<Offer[]> {
    return this.offersRepository.find();
  }
  
  findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOne({ where: { id } });
  }
  
  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.findOne(id);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    Object.assign(offer, updateOfferDto);
    return this.offersRepository.save(offer);
  }
  
  async remove(id: number): Promise<void> {
    const offer = await this.findOne(id);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    await this.offersRepository.remove(offer);
  }
}
