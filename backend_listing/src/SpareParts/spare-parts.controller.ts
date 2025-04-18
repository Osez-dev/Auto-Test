import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { SparePartsService } from './spare-parts.service';
import { CreateSparePartDto } from './dto/create-spare-part.dto';

@Controller('spare-parts')
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @Post()
  async create(@Body() createSparePartDto: CreateSparePartDto) {
    console.log("Received payload:", createSparePartDto);
    return this.sparePartsService.create(createSparePartDto);
  }

  @Get()
async findAll() {
  return this.sparePartsService.findAll();
} 
  @Get('by-keywords')
  async findByKeywords(@Query('keywords') keywords: string) {
    const keywordArray = keywords.split(',').map((k) => k.trim());
    return this.sparePartsService.findByKeywordsOnly(keywordArray);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: Partial<CreateSparePartDto>,
  ) {
    return this.sparePartsService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.sparePartsService.delete(id);
  }
}
