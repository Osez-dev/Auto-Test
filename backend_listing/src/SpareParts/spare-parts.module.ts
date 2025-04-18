import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePartsService } from './spare-parts.service';
import { SparePartsController } from './spare-parts.controller';
import { SparePart } from './entities/spare-part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SparePart])],
  providers: [SparePartsService],
  controllers: [SparePartsController],
  exports: [SparePartsService], // Export SparePartsService
})
export class SparePartsModule {}
