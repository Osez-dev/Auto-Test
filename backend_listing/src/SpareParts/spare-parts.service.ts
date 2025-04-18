import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SparePart } from './entities/spare-part.entity';
import { CreateSparePartDto } from './dto/create-spare-part.dto';

@Injectable()
export class SparePartsService {
  constructor(
    @InjectRepository(SparePart)
    private readonly sparePartsRepository: Repository<SparePart>,
  ) {}

  async create(createSparePartDto: CreateSparePartDto): Promise<SparePart> {
    const sparePart = this.sparePartsRepository.create(createSparePartDto);
    return this.sparePartsRepository.save(sparePart);
  }

  // Find all spare parts
  async findAll(): Promise<SparePart[]> {
    return this.sparePartsRepository.find();
  }
  
  async findByMakeOrModelInKeywords(make: string, model: string): Promise<SparePart[]> {
    return this.sparePartsRepository
      .createQueryBuilder('sparePart')
      .where('FIND_IN_SET(:make, sparePart.keywords)', { make })
      .orWhere('FIND_IN_SET(:model, sparePart.keywords)', { model })
      .getMany();
  }

  async findByKeywordsOnly(keywordArray: string[]): Promise<SparePart[]> {
    const query = this.sparePartsRepository
      .createQueryBuilder('sparePart');
  
    keywordArray.forEach((keyword, index) => {
      query.orWhere(`FIND_IN_SET(:keyword${index}, sparePart.keywords)`, {
        [`keyword${index}`]: keyword,
      });
    });
  
    return query.getMany();
  }

  async update(id: number, updateDto: Partial<CreateSparePartDto>): Promise<SparePart> {
    const sparePart = await this.sparePartsRepository.findOneBy({ id });
    if (!sparePart) {
      throw new NotFoundException(`SparePart with ID ${id} not found`);
    }
    Object.assign(sparePart, updateDto);
    return this.sparePartsRepository.save(sparePart);
  }

  async delete(id: number): Promise<void> {
    const result = await this.sparePartsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`SparePart with ID ${id} not found`);
    }
  }
}
