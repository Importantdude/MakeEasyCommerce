import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
