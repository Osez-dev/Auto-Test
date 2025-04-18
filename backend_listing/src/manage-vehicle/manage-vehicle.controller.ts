import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ManageVehicleService } from './manage-vehicle.service';
import { CreateManageVehicleDto } from './dto/create-manage-vehicle.dto';

import { CreateServiceHistoryDto } from './dto/create-service-history.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('manage-vehicle')
@UseGuards(AuthGuard('jwt'))
export class ManageVehicleController {
  private readonly logger = new Logger(ManageVehicleController.name);

  constructor(private readonly manageVehicleService: ManageVehicleService) {}

  @Post()
  async create(@Body() createManageVehicleDto: CreateManageVehicleDto, @Req() req) {
    try {
      this.logger.log('Received create vehicle request');
      this.logger.debug('Request body:', createManageVehicleDto);
      this.logger.debug('User from request:', req.user);

      if (!req.user || !req.user.id) {
        this.logger.warn('Unauthorized attempt to create vehicle');
        throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const result = await this.manageVehicleService.create(createManageVehicleDto, req.user.id);
      this.logger.log('Vehicle created successfully');
      return result;
    } catch (error) {
      this.logger.error('Error in create vehicle:', error.stack);
      throw error;
    }
  }

  @Get()
  findAll(@Req() req) {
    return this.manageVehicleService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.manageVehicleService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManageVehicleDto: Partial<CreateManageVehicleDto>,
    @Req() req,
  ) {
    return this.manageVehicleService.update(+id, updateManageVehicleDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.manageVehicleService.remove(+id, req.user.id);
  }

  @Post('service-history')
  async addServiceHistory(@Body() createServiceHistoryDto: CreateServiceHistoryDto, @Req() req) {
    try {
      this.logger.log('Received add service history request');
      this.logger.debug('Request body:', createServiceHistoryDto);

      if (!req.user || !req.user.id) {
        this.logger.warn('Unauthorized attempt to add service history');
        throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const result = await this.manageVehicleService.addServiceHistory(createServiceHistoryDto);
      this.logger.log('Service history added successfully');
      return result;
    } catch (error) {
      this.logger.error('Error in add service history:', error.stack);
      throw error;
    }
  }

  @Get('service-history/:vehicleId')
  async getServiceHistory(@Param('vehicleId') vehicleId: string, @Req() req) {
    try {
      this.logger.log('Received get service history request');
      this.logger.debug('Vehicle ID:', vehicleId);

      if (!req.user || !req.user.id) {
        this.logger.warn('Unauthorized attempt to get service history');
        throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const result = await this.manageVehicleService.getServiceHistory(parseInt(vehicleId));
      this.logger.log('Service history retrieved successfully');
      return result;
    } catch (error) {
      this.logger.error('Error in get service history:', error.stack);
      throw error;
    }
  }
} 