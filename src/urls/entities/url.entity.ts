import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
  } from 'typeorm';
  
  @Entity('urls')
  export class UrlEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    originalUrl: string;
  
    @Column()
    shortenedUrlId: string;
  
    @Column({ default: 0 })
    clickCount: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null;
  
    @Column({ nullable: true })
    userId: string | null;
  
    @Column({ nullable: true })
    domain: string | null;
  }