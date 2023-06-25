import { IsEmail, IsNumber, IsString } from "class-validator";
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
    @ManyToOne(() => Customer, (customer) => customer.customer_address )
        customer: CustomerAddress[];
    @OneToOne(() => CustomerAddressDetails, { cascade: true })
    @JoinColumn()
        address_details: CustomerAddressDetails
}