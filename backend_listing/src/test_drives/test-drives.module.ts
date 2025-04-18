import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDrivesService } from './test-drives.service';
import { TestDrivesController } from './test-drives.controller';
import { TestDrive } from './entities/test-drive.entity';
import { ListingsModule } from '../listings/listings.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TestDrive]), ListingsModule, UsersModule],
  providers: [TestDrivesService],
  controllers: [TestDrivesController],
  exports: [TestDrivesService],
})
export class TestDrivesModule {}
