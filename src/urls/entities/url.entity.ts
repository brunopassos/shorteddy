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
    original_url: string;
  
    @Column()
    shortened_url_id: string;
  
    @Column({ default: 0 })
    click_count: number;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn({ nullable: true })
    deleted_at: Date | null;
  
    @Column({ nullable: true })
    user_id: string | null;
  
    @Column({ nullable: true })
    domain: string | null;
  }