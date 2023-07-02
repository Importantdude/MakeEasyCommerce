import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	ValidateNested,
	IsNotEmpty,
	IsEmail,
	IsOptional,
	IsNumber,
} from 'class-validator';
import { AddressDto } from './address/customer-address.dto';

export class CustomerDto {
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		first_name: string;
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		last_name: string;
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
		email: string;
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
		store_id: number;
}

export class CreateCustomerDto extends CustomerDto {
	@IsOptional()
	@ApiProperty({ type: () => [AddressDto] })
	@ValidateNested({ each:true })
		customer_address : AddressDto[]
}
