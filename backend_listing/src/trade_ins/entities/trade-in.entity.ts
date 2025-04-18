import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('trade_ins')
export class TradeIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  transmission: string;

  @Column()
  mileage: number;

  @Column()
  vin: string;

  @Column('simple-array', { nullable: true })
  carPhotos: string[];

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  exteriorColor: string;

  @Column({ nullable: true })
  interiorColor: string;

  @Column({ nullable: true })
  owner: string;

  @Column({ nullable: true })
  exteriorCondition: string;

  @Column({ nullable: true })
  interiorCondition: string;

  @Column({ nullable: true })
  vehicleBeenInAccident: boolean;

  @ManyToOne(() => User, user => user.tradeIns, { eager: true })
  user: User;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  emailAddress: string;

  @Column()
  phoneNumber: string;

  @Column('text')
  comments: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
