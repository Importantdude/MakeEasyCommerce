import { Basket } from '@src/basket/entities/basket.entity';
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
    @Column('simple-array')
    address_ids: number[];
    @ManyToMany(() => Basket, {
        eager: true,
        cascade: true,
    })
    @JoinTable({
        name: 'web_order_basket',
        joinColumn: {
            name: 'order',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_order_basket_orderId',
        },
        inverseJoinColumn: {
            name: 'basket',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk_order_basket_basketId',
        },
        synchronize: true,
    })
    baskets: Basket[];

    @RelationId((order: Order) => order.baskets)
    basket_ids: number[];
}
