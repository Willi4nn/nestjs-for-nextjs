import { IsBoolean, IsEmail, IsString, IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', default: 'default_password' })
  @IsString()
  password: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  forceLogout: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
