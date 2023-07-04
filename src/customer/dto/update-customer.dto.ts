import { ApiProperty } from '@nestjs/swagger';
import { CustomerDto } from './create-customer.dto';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { AddressDetailsDto, AddressDto } from './address/customer-address.dto';

export class UpdateAddressDetailsDto extends AddressDetailsDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;
}

export class UpdateAddressDto extends AddressDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;
    @IsNotEmpty()
    @ApiProperty({ type: () => UpdateAddressDetailsDto })
    @ValidateNested()
    address_details: UpdateAddressDetailsDto;
}

export class UpdateCustomerAddressDto extends UpdateAddressDto {}

export class UpdateCustomerDto extends CustomerDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    id: number;
    @IsNotEmpty()
    @ApiProperty({ type: () => [UpdateAddressDto] })
    @ValidateNested()
    customer_address: UpdateAddressDto[];
}
