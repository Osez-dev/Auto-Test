import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { User } from '../../users/entities/user.entity';

@Entity('test_drives')
export class TestDrive {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Listing, listing => listing.testDrives, { eager: true })
  listing: Listing;

  @ManyToOne(() => User, user => user.testDrives, { eager: true })
  user: User;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  time: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
