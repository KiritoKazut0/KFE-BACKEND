import { Entity, Column, PrimaryColumn } from 'typeorm';
import type { UserRole } from '../../domain/user';

@Entity('users')
export class UserModel {

    @PrimaryColumn('uuid') 
    id!: string;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255 })
    password!: string;

    @Column({ type: 'enum', enum: ['MANAGER', 'CASHIER', 'ADMIN'], default: 'CASHIER' })
    role!: UserRole;

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;

    @Column({ name: 'deleted_at', type: 'timestamp', nullable: true, default: null })
    deletedAt!: Date | null;
}