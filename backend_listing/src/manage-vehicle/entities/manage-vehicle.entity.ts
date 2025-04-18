import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ServiceHistory } from './service-history.entity';

@Entity('manage_vehicles')
export class ManageVehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  registrationNumber: string;

  @Column()
  color: string;

  @Column({
    type: 'enum',
    enum: ['owned', 'leased', 'financed'],
    default: 'owned'
  })
  ownershipStatus: string;

  @Column({
    type: 'enum',
    enum: ['excellent', 'good', 'fair'],
    default: 'good'
  })
  condition: string;

  @Column()
  currentMileage: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ServiceHistory, serviceHistory => serviceHistory.vehicle)
  serviceHistory: ServiceHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 