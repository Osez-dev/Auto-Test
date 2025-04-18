import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TestDrivesService } from './test-drives.service';
import { CreateTestDriveDto } from './dto/create-test-drive.dto';
import { UpdateTestDriveDto } from './dto/update-test-drive.dto';

@Controller('test-drives')
export class TestDrivesController {
  constructor(private readonly testDrivesService: TestDrivesService) {}
  
  @Post()
  @UseGuards()
  create(@Body() createTestDriveDto: CreateTestDriveDto) {
    return this.testDrivesService.create(createTestDriveDto);
  }
  
  @Get()
  findAll() {
    return this.testDrivesService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.testDrivesService.findOne(id);
  }
  
  @Put(':id')
  @UseGuards()
  update(@Param('id') id: number, @Body() updateTestDriveDto: UpdateTestDriveDto) {
    return this.testDrivesService.update(id, updateTestDriveDto);
  }
  
  @Delete(':id')
  @UseGuards()
  remove(@Param('id') id: number) {
    return this.testDrivesService.remove(id);
  }
}
