import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TradeInsService } from './trade-ins.service';
import { CreateTradeInDto } from './dto/create-trade-in.dto';
import { UpdateTradeInDto } from './dto/update-trade-in.dto';

@Controller('trade-ins')
export class TradeInsController {
  constructor(private readonly tradeInsService: TradeInsService) {}
  
  @Post()
  @UseGuards()
  create(@Body() createTradeInDto: CreateTradeInDto) {
    return this.tradeInsService.create(createTradeInDto);
  }
  
  @Get()
  findAll() {
    return this.tradeInsService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tradeInsService.findOne(id);
  }
  
  @Put(':id')
  @UseGuards()
  update(@Param('id') id: number, @Body() updateTradeInDto: UpdateTradeInDto) {
    return this.tradeInsService.update(id, updateTradeInDto);
  }
  
  @Delete(':id')
  @UseGuards()
  remove(@Param('id') id: number) {
    return this.tradeInsService.remove(id);
  }
}
