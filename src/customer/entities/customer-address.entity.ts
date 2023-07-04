import { IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { CustomerAddressDetails } from "./customer-address-detailed.entity";

@Entity()
export class CustomerAddress {
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
    @ManyToOne(() => Customer, (customer) => customer.customer_address, { onDelete: 'CASCADE' })
    // Investigate
    // @JoinColumn(
    // {
    //     name: 'customer_id',
    //     referencedColumnName: "id" ,
    //     foreignKeyConstraintName: "fk_customer_index_address"
    // })
        customer: CustomerAddress[];
    @OneToOne(() => CustomerAddressDetails, (address_details) => address_details.customer_address, { 
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({
        name: 'address_details_id',
        foreignKeyConstraintName: "fk_address_index_details"
    })
        address_details: CustomerAddressDetails
}