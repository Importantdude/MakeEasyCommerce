import { IsString } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';

@Entity('customer_address_details')
export class Details {
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
    @OneToOne(() => Address, (address) => address.details)
    address: Address;
}
