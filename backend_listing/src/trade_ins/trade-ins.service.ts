import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TradeIn } from './entities/trade-in.entity';
import { CreateTradeInDto } from './dto/create-trade-in.dto';
import { UpdateTradeInDto } from './dto/update-trade-in.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TradeInsService {
  constructor(
    @InjectRepository(TradeIn)
    private tradeInsRepository: Repository<TradeIn>,
    private usersService: UsersService,
  ) {}
  
  async create(createTradeInDto: CreateTradeInDto): Promise<TradeIn> {
    const user = await this.usersService.findOne(createTradeInDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tradeIn = this.tradeInsRepository.create({ ...createTradeInDto, user });
    return this.tradeInsRepository.save(tradeIn);
  }
  
  findAll(): Promise<TradeIn[]> {
    return this.tradeInsRepository.find();
  }
  
  findOne(id: number): Promise<TradeIn> {
    return this.tradeInsRepository.findOne({ where: { id } });
  }
  
  async update(id: number, updateTradeInDto: UpdateTradeInDto): Promise<TradeIn> {
    const tradeIn = await this.findOne(id);
    if (!tradeIn) {
      throw new NotFoundException('Trade-In not found');
    }
    Object.assign(tradeIn, updateTradeInDto);
    return this.tradeInsRepository.save(tradeIn);
  }
  
  async remove(id: number): Promise<void> {
    const tradeIn = await this.findOne(id);
    if (!tradeIn) {
      throw new NotFoundException('Trade-In not found');
    }
    await this.tradeInsRepository.remove(tradeIn);
  }
}
