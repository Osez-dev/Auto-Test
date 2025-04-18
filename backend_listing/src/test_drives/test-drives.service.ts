import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TestDrive } from './entities/test-drive.entity';
import { CreateTestDriveDto } from './dto/create-test-drive.dto';
import { UpdateTestDriveDto } from './dto/update-test-drive.dto';
import { ListingsService } from '../listings/listings.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TestDrivesService {
  constructor(
    @InjectRepository(TestDrive)
    private testDrivesRepository: Repository<TestDrive>,
    private listingsService: ListingsService,
    private usersService: UsersService,
  ) {}
  
  async create(createTestDriveDto: CreateTestDriveDto): Promise<TestDrive> {
    const listing = await this.listingsService.findOne(createTestDriveDto.listingId);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const user = await this.usersService.findOne(createTestDriveDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const testDrive = this.testDrivesRepository.create({
      ...createTestDriveDto,
      listing,
      user,
      time: new Date(createTestDriveDto.time),
    });
    return this.testDrivesRepository.save(testDrive);
  }
  
  findAll(): Promise<TestDrive[]> {
    return this.testDrivesRepository.find();
  }
  
  findOne(id: number): Promise<TestDrive> {
    return this.testDrivesRepository.findOne({ where: { id } });
  }
  
  async update(id: number, updateTestDriveDto: UpdateTestDriveDto): Promise<TestDrive> {
    const testDrive = await this.findOne(id);
    if (!testDrive) {
      throw new NotFoundException('Test Drive not found');
    }
    if (updateTestDriveDto.time) {
      updateTestDriveDto.time = new Date(updateTestDriveDto.time).toISOString();
    }
    Object.assign(testDrive, updateTestDriveDto);
    return this.testDrivesRepository.save(testDrive);
  }
  
  async remove(id: number): Promise<void> {
    const testDrive = await this.findOne(id);
    if (!testDrive) {
      throw new NotFoundException('Test Drive not found');
    }
    await this.testDrivesRepository.remove(testDrive);
  }
}
