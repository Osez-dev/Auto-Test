import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeasingCompany } from './entities/leasing-company.entity';
import { CreateLeasingCompanyDto } from './dto/create-leasing-company.dto';

@Injectable()
export class LoanCalculatorService {
  constructor(
    @InjectRepository(LeasingCompany)
    private readonly leasingCompanyRepository: Repository<LeasingCompany>,
  ) {}

  async createLeasingCompany(createLeasingCompanyDto: CreateLeasingCompanyDto): Promise<LeasingCompany> {
    try {
      // Validate input
      if (!createLeasingCompanyDto.companyName?.trim()) {
        throw new BadRequestException('Company name is required');
      }
      if (createLeasingCompanyDto.interestRate < 0 || createLeasingCompanyDto.interestRate > 100) {
        throw new BadRequestException('Interest rate must be between 0 and 100');
      }
      if (createLeasingCompanyDto.termInMonths < 1 || createLeasingCompanyDto.termInMonths > 360) {
        throw new BadRequestException('Term must be between 1 and 360 months');
      }

      const company = this.leasingCompanyRepository.create(createLeasingCompanyDto);
      return await this.leasingCompanyRepository.save(company);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to save leasing company');
    }
  }

  async updateLeasingCompany(id: number, updateLeasingCompanyDto: CreateLeasingCompanyDto): Promise<LeasingCompany> {
    try {
      // Validate input
      if (!updateLeasingCompanyDto.companyName?.trim()) {
        throw new BadRequestException('Company name is required');
      }
      if (updateLeasingCompanyDto.interestRate < 0 || updateLeasingCompanyDto.interestRate > 100) {
        throw new BadRequestException('Interest rate must be between 0 and 100');
      }
      if (updateLeasingCompanyDto.termInMonths < 1 || updateLeasingCompanyDto.termInMonths > 360) {
        throw new BadRequestException('Term must be between 1 and 360 months');
      }

      // Find existing company
      const company = await this.leasingCompanyRepository.findOne({ where: { id } });
      if (!company) {
        throw new NotFoundException(`Leasing company with ID ${id} not found`);
      }

      // Update company
      Object.assign(company, updateLeasingCompanyDto);
      return await this.leasingCompanyRepository.save(company);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update leasing company');
    }
  }

  async deleteLeasingCompany(id: number): Promise<void> {
    try {
      const company = await this.leasingCompanyRepository.findOne({ where: { id } });
      if (!company) {
        throw new NotFoundException(`Leasing company with ID ${id} not found`);
      }

      await this.leasingCompanyRepository.remove(company);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete leasing company');
    }
  }

  async getAllLeasingCompanies(): Promise<LeasingCompany[]> {
    return await this.leasingCompanyRepository.find();
  }

  async getLeasingCompanyById(id: number): Promise<LeasingCompany> {
    const company = await this.leasingCompanyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Leasing company with ID ${id} not found`);
    }
    return company;
  }

  calculateLoanPayment(
    vehiclePrice: number,
    downPayment: number,
    interestRate: number,
    termInMonths: number,
  ): { monthlyPayment: number; totalPayment: number; totalInterest: number } {
    const loanAmount = vehiclePrice - downPayment;
    const monthlyInterest = interestRate / 12 / 100;
    
    const monthlyPayment =
      (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, termInMonths)) /
      (Math.pow(1 + monthlyInterest, termInMonths) - 1);

    const totalPayment = monthlyPayment * termInMonths;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    };
  }
} 