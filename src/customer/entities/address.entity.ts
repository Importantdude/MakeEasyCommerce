import { IsNumber, IsString } from 'class-validator';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Details } from './details.entity';

@Entity('customer_address_index')
export class Address {
    @PrimaryGeneratedColumn()
    id: number;
    @IsString()
    @Column()
    country: string;
    @IsString()
    @Column()
    postal_code: string;
    @IsNumber()
    @Column()
    address_type: number;
    @Index()
    @ManyToOne(() => Customer, (customer) => customer.address, {
        onDelete: 'CASCADE',
    })
    // Investigate
    // @JoinColumn(
    // {
    //     name: 'customer_id',
    //     referencedColumnName: "id" ,
    //     foreignKeyConstraintName: "fk_customer_index_address"
    // })
    customer: Address[];
    @Index()
    @OneToOne(() => Details, (details) => details.address, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({
        name: 'details_id',
        foreignKeyConstraintName: 'fk_address_index_details',
    })
    details: Details;
}
