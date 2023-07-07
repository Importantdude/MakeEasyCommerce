import { Basket } from '@src/basket/entities/basket.entity';
import { Customer } from '@src/customer/entities/customer.entity';
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
export class Order {
    @PrimaryGeneratedColumn()
    id: number;
    @IsNumber()
    @Column()
    order_type: number;
    @IsNumber()
    @Column()
    order_status: number;
    @ManyToMany(() => Basket, {
        cascade: true,
        eager: true,
    })
    @JoinTable({
        name: 'order_baskets',
        joinColumn: {
            name: 'order_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_order_basket_orderId',
        },
        inverseJoinColumn: {
            name: 'basket_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_order_basket_basketId',
        },
        synchronize: true,
    })
    baskets: Basket[];

    @RelationId((order: Order) => order.baskets)
    basket_ids: number[];

    @ManyToMany(() => Customer, {
        cascade: true,
        eager: true,
    })
    @JoinTable({
        name: 'order_customer',
        joinColumn: {
            name: 'order_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_order_customer_orderId',
        },
        inverseJoinColumn: {
            name: 'customer_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_order_customer_customerId',
        },
        synchronize: true,
    })
    customers: Customer[];

    @RelationId((order: Order) => order.customers)
    customers_ids: number[];
}
