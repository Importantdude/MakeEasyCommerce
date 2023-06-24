import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
	IsString,
	IsOptional,
	ValidateNested,
	IsNumber,
	IsNotEmpty,
	IsEmail
} from 'class-validator';
import { CreateCustomerDto, CustomerDto } from './create-customer.dto';
import { AddressDetailsDto, AddressDto } from './address/customer-address.dto';

export class GetCustomerDto extends CustomerDto {
	@IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		id: number;
	@IsNotEmpty()
	@ApiProperty({ type: () => [GetCustomerAddressDto] })
	@ValidateNested({ each:true })
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
	@IsOptional()
	@ApiProperty({ type: () => GetAddressDetailsDto })
	@ValidateNested()
		address_details: GetAddressDetailsDto
}

export class CustomerShortDto {
	@IsNumber()
    @IsNotEmpty()
	@ApiProperty()
		id: number;
}

