import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ValidateNested, IsNumber, IsNotEmpty } from 'class-validator';
import { CustomerDto } from './create-customer.dto';
import {
    AddressDetailsDto,
    AddressDto,
    AddressShortDto,
} from './address/customer-address.dto';

export class GetCustomerDto extends CustomerDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;
    @IsNotEmpty()
    @ApiProperty({ type: () => [GetCustomerAddressDto] })
    @ValidateNested()
    customer_address: GetCustomerAddressDto[];
}

export class GetAddressDetailsDto extends AddressDetailsDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;
}

export class GetCustomerAddressDto extends AddressDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;
    @IsNotEmpty()
    @ApiProperty({ type: () => GetAddressDetailsDto })
    @ValidateNested()
    address_details: GetAddressDetailsDto;
}

export class GetCustomerAddressShortDto extends AddressShortDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;
}

export class GetCustomerShortDto extends CustomerDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;
}

// export class GetBasketCustomerDto extends PartialType(CustomerDto) {
export class GetBasketCustomerDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;
}

export class GetAddressCustomerDto extends GetCustomerAddressDto {
    @IsNotEmpty()
    @ApiProperty({ type: () => GetCustomerShortDto })
    customer: GetCustomerShortDto;
}
