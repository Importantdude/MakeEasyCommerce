import { IsNumber } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Basket {
    @PrimaryGeneratedColumn()
    id: number;
    @IsNumber()
    @Column()
    store_id: number;
    @IsNumber()
    @Column()
    product_count: number;
    @Column({
        type: 'numeric',
        precision: 20,
        scale: 2,
    })
    basket_final_price: number;

    // Many Products can be assigned to basket
    @Column('simple-array')
    product_ids: number[];

    // Customer represented as array
    // due to feature of splitted order
    // where one order has two customers
    @Column('simple-array')
    customer_ids: number[];
}

// In future -> after will appear eav solution
// with elastic here should appear new entity
// named "Personalization" -> goal of it
// is to include order-product-personalization
// and also promo rules (Marketing) for example
// 1. Send specific newsletter (email) based on
// which coupon code that was used
// 2. For orders -> add give away product
// based on code or country/city or birthday
// end etc.

// P.S. -> EAV supposed to handle request mentioned below
