import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    ValidateNested,
    IsNotEmpty,
    IsEmail,
    IsNumber,
    IsOptional,
} from 'class-validator';
import { CreateAddressDto } from './address/create-address.dto';

export class CustomerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    first_name: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    last_name: string;
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    store_id: number;
    // @ApiProperty({ type: [Number] })
    address_ids: number[];
}

export class CreateCustomerDto extends CustomerDto {}

export class CreateCustomerAddressDto extends CustomerDto {
    address: CreateAddressDto[];
}
