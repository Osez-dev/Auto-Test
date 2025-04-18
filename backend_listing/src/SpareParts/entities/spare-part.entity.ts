// src/spare-parts/entities/spare-part.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('spare_parts')
  export class SparePart {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column('text')
    description: string;
  
    @Column('simple-array') // Store keywords as a comma-separated string in the database
    keywords: string[];
  
    @Column('int', { default: 0 })
    stock: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @Column('simple-array', { nullable: true })
    imageUrls: string[];
  }
  