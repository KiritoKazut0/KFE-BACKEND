import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('categories')
export class CategoryModel {
    @PrimaryColumn({ type: 'uuid' })
    id!: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    name!: string;

    @Column({ type: 'varchar', length: 255 })
    description!: string;

    @Column({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @Column({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;

    @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deletedAt!: Date | null;
}