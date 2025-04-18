import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leasing_companies')
export class LeasingCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column('decimal', { precision: 5, scale: 2 })
  interestRate: number;

  @Column()
  termInMonths: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 