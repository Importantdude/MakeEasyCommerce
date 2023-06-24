import { IsEmail, IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { CustomerAddress } from "./customer-address.entity";

@Entity()
@Unique(['email'])
export class Customer {
    @PrimaryGeneratedColumn()
        id: number;
    @IsString()
    @Column()
        first_name: string;
    @IsString()
    @Column()
        last_name: string;
    @IsEmail()
    @Column()
        email: string;
    @IsNumber()
    @Column()
        store_id: number;
    @OneToMany(() => CustomerAddress, (customer_address) => customer_address.customer, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({
        foreignKeyConstraintName: "fk_customer_index_index"
    })
        customer_address: CustomerAddress[];
}
