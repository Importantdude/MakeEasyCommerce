import { IsEmail, IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { CustomerAddress } from "./customer-address.entity";

@Entity()
export class CustomerAddressDetails {
    @PrimaryGeneratedColumn()
        id: number;
    @IsString()
    @Column()
        city: string;
    @IsString()
    @Column()
        street_name: string;
    @IsString()
    @Column()
        house_number: string;
    @IsString()
    @Column()
        phone_number: string;
    @IsString()
    @Column()
        company: string;
    @IsString()
    @Column()
        tax_id: string;
    // @OneToOne(() => CustomerAddress, (customer_address) => customer_address.address_details)
    //     customer_address: CustomerAddress;
}
