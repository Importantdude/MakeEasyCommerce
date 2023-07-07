import { Customer } from '@src/customer/entities/customer.entity';
import { Product } from '@src/product/entities/product.entity';
import { IsNumber } from 'class-validator';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';

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

    @ManyToMany(() => Product, {
        eager: true,
        cascade: true,
    })
    @JoinTable({
        name: 'basket_products',
        joinColumn: {
            name: 'basket_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_basket_product_basketId',
        },
        inverseJoinColumn: {
            name: 'product_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_basket_product_productId',
        },
        synchronize: true,
    })
    products: Product[];
    // Many Products can be assigned to basket

    // @Column('simple-array')
    @RelationId((basket: Basket) => basket.products)
    product_ids: number[];

    // Customer represented as array
    // due to feature of splitted order
    // where one order has two customers
    // @Column('simple-array')
    // customer_ids: number[];

    @ManyToMany(() => Customer, {
        eager: true,
        cascade: true,
    })
    @JoinTable({
        name: 'basket_customers',
        joinColumn: {
            name: 'basket_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_basket_customer_basketId',
        },
        inverseJoinColumn: {
            name: 'customer_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_basket_customer_customerId',
        },
        synchronize: true,
    })
    customers: Customer[];

    @RelationId((basket: Basket) => basket.customers)
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
