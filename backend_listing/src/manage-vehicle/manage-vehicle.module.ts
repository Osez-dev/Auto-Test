import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManageVehicleService } from './manage-vehicle.service';
import { ManageVehicleController } from './manage-vehicle.controller';
import { ManageVehicle } from './entities/manage-vehicle.entity';
import { ServiceHistory } from './entities/service-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ManageVehicle, ServiceHistory])
  ],
  controllers: [ManageVehicleController],
  providers: [ManageVehicleService],
  exports: [ManageVehicleService]
})
export class ManageVehicleModule {} 