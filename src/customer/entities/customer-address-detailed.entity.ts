import { IsString } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerAddress } from './customer-address.entity';

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
    @OneToOne(
        () => CustomerAddress,
        (customer_address) => customer_address.address_details,
        {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    )
    customer_address: CustomerAddress;
}
