import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	ValidateNested,
	IsNumber,
	IsNotEmpty
} from 'class-validator';
import { CustomerDto } from './create-customer.dto';
import { AddressDetailsDto, AddressDto } from './address/customer-address.dto';

export class GetCustomerDto extends CustomerDto {
	@IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		id: number;
	@IsNotEmpty()
	@ApiProperty({ type: () => [GetCustomerAddressDto] })
	@ValidateNested()
		customer_address : GetCustomerAddressDto[]
}

export class GetAddressDetailsDto extends (AddressDetailsDto){
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
		address_details: GetAddressDetailsDto
}

export class GetCustomerShortDto extends CustomerDto{
	@IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		id: number;
}

