import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
