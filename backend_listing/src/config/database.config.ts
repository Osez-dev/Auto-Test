import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Offer } from 'src/offers/entities/offer.entity';
import { TradeIn } from 'src/trade_ins/entities/trade-in.entity';
import { TestDrive } from 'src/test_drives/entities/test-drive.entity';
import { Listing } from 'src/listings/entities/listing.entity';
import { User } from 'src/users/entities/user.entity';
import { News } from 'src/AutoNews/entity/news.entity';
import { SparePart } from 'src/SpareParts/entities/spare-part.entity';
import { LeasingCompany } from 'src/LoanCalculator/entities/leasing-company.entity';
import { Review } from 'src/reviews/entities/reviews.entitiy';
import { ManageVehicle } from 'src/manage-vehicle/entities/manage-vehicle.entity';
import { ServiceHistory } from 'src/manage-vehicle/entities/service-history.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

export const typeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT'), 10) || 3306,
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [Listing, Offer, TradeIn, TestDrive, User, News, SparePart, LeasingCompany, Review, ManageVehicle, ServiceHistory, Appointment],
  synchronize: true, // Set to false in production
  migrationsRun: true, // Automatically run migrations on app startup
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
});
