import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Listing } from 'src/listings/entities/listing.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { TestDrive } from 'src/test_drives/entities/test-drive.entity';
import { TradeIn } from 'src/trade_ins/entities/trade-in.entity';
import { Review } from 'src/reviews/entities/reviews.entitiy';
import { ManageVehicle } from 'src/manage-vehicle/entities/manage-vehicle.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  password: string; // This will store hashed passwords

  @Column({ default: 'customer' })
  role: string; // Roles: 'customer', 'admin', 'dealer'

  @OneToMany(() => Listing, (listing) => listing.user)
  listings: Listing[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => TradeIn, (tradeIn) => tradeIn.user)
  tradeIns: TradeIn[];

  @OneToMany(() => TestDrive, (testDrive) => testDrive.user)
  testDrives: TestDrive[];

  @OneToMany(() => ManageVehicle, (vehicle) => vehicle.user)
  managedVehicles: ManageVehicle[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column({ nullable: true })
  refreshToken: string; // Stores hashed refresh tokens

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true, type: 'timestamp' })
  emailVerificationExpires: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ nullable: true })
  passwordResetExpires?: Date;

  @OneToMany(() => Review, (review) => review.submittedBy)
  submittedReviews: Review[];

  @OneToMany(() => Review, (review) => review.submittedFor)
  receivedReviews: Review[];
}
