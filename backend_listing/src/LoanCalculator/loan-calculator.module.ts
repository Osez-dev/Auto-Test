import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanCalculatorController } from './loan-calculator.controller';
import { LoanCalculatorService } from './loan-calculator.service';
import { LeasingCompany } from './entities/leasing-company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeasingCompany]),
  ],
  controllers: [LoanCalculatorController],
  providers: [LoanCalculatorService],
  exports: [LoanCalculatorService],
})
export class LoanCalculatorModule {} 