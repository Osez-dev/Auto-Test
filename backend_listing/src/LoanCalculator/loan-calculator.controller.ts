import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { LoanCalculatorService } from './loan-calculator.service';
import { CreateLeasingCompanyDto } from './dto/create-leasing-company.dto';

@Controller('loan-calculator')
export class LoanCalculatorController {
  constructor(private readonly loanCalculatorService: LoanCalculatorService) {}

  @Post('leasing-company')
  async createLeasingCompany(@Body() createLeasingCompanyDto: CreateLeasingCompanyDto) {
    return await this.loanCalculatorService.createLeasingCompany(createLeasingCompanyDto);
  }

  @Put('leasing-company/:id')
  async updateLeasingCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeasingCompanyDto: CreateLeasingCompanyDto,
  ) {
    return await this.loanCalculatorService.updateLeasingCompany(id, updateLeasingCompanyDto);
  }

  @Delete('leasing-company/:id')
  async deleteLeasingCompany(@Param('id', ParseIntPipe) id: number) {
    return await this.loanCalculatorService.deleteLeasingCompany(id);
  }

  @Get('leasing-companies')
  async getAllLeasingCompanies() {
    return await this.loanCalculatorService.getAllLeasingCompanies();
  }

  @Get('leasing-company/:id')
  async getLeasingCompanyById(@Param('id', ParseIntPipe) id: number) {
    return await this.loanCalculatorService.getLeasingCompanyById(id);
  }

  @Get('calculate')
  calculateLoan(
    @Query('vehiclePrice', ParseIntPipe) vehiclePrice: number,
    @Query('downPayment', ParseIntPipe) downPayment: number,
    @Query('interestRate', ParseIntPipe) interestRate: number,
    @Query('termInMonths', ParseIntPipe) termInMonths: number,
  ) {
    return this.loanCalculatorService.calculateLoanPayment(
      vehiclePrice,
      downPayment,
      interestRate,
      termInMonths,
    );
  }
} 