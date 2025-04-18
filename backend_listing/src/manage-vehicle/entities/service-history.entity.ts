import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ManageVehicle } from './manage-vehicle.entity';

@Entity('service_history')
export class ServiceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  serviceType: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column()
  mileage: number;

  @Column()
  nextServiceDue: Date;

  @Column()
  vehicleId: number;

  @ManyToOne(() => ManageVehicle)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: ManageVehicle;

  @CreateDateColumn()
  createdAt: Date;
} 