import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { ListingsModule } from './listings/listings.module';
import { OffersModule } from './offers/offers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TradeInsModule } from './trade_ins/trade-ins.module';
import { TestDrivesModule } from './test_drives/test-drives.module';
import { NewsModule } from './AutoNews/news.module';
import { SparePartsModule } from './SpareParts/spare-parts.module';
import { LoanCalculatorModule } from './LoanCalculator/loan-calculator.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ManageVehicleModule } from './manage-vehicle/manage-vehicle.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    ListingsModule,
    OffersModule,
    TradeInsModule,
    TestDrivesModule,
    UsersModule,
    AuthModule,
    NewsModule,
    SparePartsModule,
    LoanCalculatorModule,
    ReviewsModule,
    AppointmentsModule,
    ManageVehicleModule,
  ],
})
export class AppModule {}
