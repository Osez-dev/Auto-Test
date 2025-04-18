import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
