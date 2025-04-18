import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { ManageVehicle } from './entities/manage-vehicle.entity';
import { ServiceHistory } from './entities/service-history.entity';
import { CreateManageVehicleDto } from './dto/create-manage-vehicle.dto';
import { CreateServiceHistoryDto } from './dto/create-service-history.dto';

@Injectable()
export class ManageVehicleService {
  private readonly logger = new Logger(ManageVehicleService.name);

  constructor(
    @InjectRepository(ManageVehicle)
    private manageVehicleRepository: Repository<ManageVehicle>,
    @InjectRepository(ServiceHistory)
    private readonly serviceHistoryRepository: Repository<ServiceHistory>,
    private connection: Connection,
  ) {}

  async create(createManageVehicleDto: CreateManageVehicleDto, userId: number): Promise<ManageVehicle> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log(`Creating vehicle for user ${userId}`);
      this.logger.debug('Vehicle data:', createManageVehicleDto);

      // Check if table exists
      const tableExists = await queryRunner.hasTable('manage_vehicles');
      this.logger.log(`Table 'manage_vehicles' exists: ${tableExists}`);

      if (!tableExists) {
        throw new InternalServerErrorException('Database table does not exist');
      }

      // Validate required fields
      if (!createManageVehicleDto.make || !createManageVehicleDto.model || !createManageVehicleDto.year) {
        throw new InternalServerErrorException('Required fields are missing');
      }

      const vehicle = this.manageVehicleRepository.create({
        ...createManageVehicleDto,
        userId,
      });

      this.logger.debug('Created vehicle entity:', vehicle);

      const savedVehicle = await this.manageVehicleRepository.save(vehicle);
      this.logger.log(`Vehicle created successfully with ID: ${savedVehicle.id}`);
      
      await queryRunner.commitTransaction();
      return savedVehicle;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error creating vehicle:', error.stack);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new InternalServerErrorException('Vehicle with this registration number already exists');
      }
      throw new InternalServerErrorException(`Failed to create vehicle: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: number): Promise<ManageVehicle[]> {
    return await this.manageVehicleRepository.find({
      where: { userId },
    });
  }

  async findOne(id: number, userId: number): Promise<ManageVehicle> {
    const vehicle = await this.manageVehicleRepository.findOne({
      where: { id, userId },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async update(id: number, updateManageVehicleDto: Partial<CreateManageVehicleDto>, userId: number): Promise<ManageVehicle> {
    const vehicle = await this.findOne(id, userId);
    Object.assign(vehicle, updateManageVehicleDto);
    return await this.manageVehicleRepository.save(vehicle);
  }

  async remove(id: number, userId: number): Promise<void> {
    const vehicle = await this.findOne(id, userId);
    await this.manageVehicleRepository.remove(vehicle);
  }

  async addServiceHistory(createServiceHistoryDto: CreateServiceHistoryDto): Promise<ServiceHistory> {
    const vehicle = await this.manageVehicleRepository.findOne({
      where: { id: createServiceHistoryDto.vehicleId }
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const serviceHistory = this.serviceHistoryRepository.create({
      ...createServiceHistoryDto,
      vehicle
    });

    return this.serviceHistoryRepository.save(serviceHistory);
  }

  async getServiceHistory(vehicleId: number): Promise<ServiceHistory[]> {
    const vehicle = await this.manageVehicleRepository.findOne({
      where: { id: vehicleId },
      relations: ['serviceHistory']
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle.serviceHistory;
  }
} 