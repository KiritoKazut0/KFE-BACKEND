
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { type ProductType } from "../../domain/product";
import { CategoryModel } from "../../../category/infrastructure/persistence/category.model";

@Entity('products')
export class ProductModel {
    @PrimaryColumn({ type: 'uuid' })
    id!: string;

    @Column({ type: 'uuid', name: 'category_id' })
    categoryId!: string;

    @ManyToOne(() => CategoryModel)
    @JoinColumn({ name: 'category_id' })
    category!: CategoryModel;

    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

    @Column({ type: 'enum', enum: ['STANDARD', 'PREPARED', 'KIT'], name: 'type_product' })
    typeProduct!: ProductType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ type: 'int', nullable: true })
    stock!: number | null;

    @Column({ type: 'boolean', name: 'active' })
    isActive!: boolean;

    @Column({ type: 'varchar', length: 255, name: 'image_url' })
    imageUrl!: string;

    @Column({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @Column({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;

    @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deletedAt!: Date | null;
}