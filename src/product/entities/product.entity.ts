import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['sku'])
export class Product {
    @PrimaryGeneratedColumn()
    id: number;
    @IsString()
    @Column()
    sku: string;
    @IsNumber()
    @Column()
    product_type: number;
    @IsNumber()
    @Column()
    visibility: number;
    @IsNumber()
    @Column()
    quantity: number;
    @Column({
        type: 'numeric',
        precision: 20,
        scale: 2,
    })
    final_price: number;
    @IsNumber()
    @Column()
    store_id: number;
}
