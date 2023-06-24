import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsOptional,
	ValidateNested,
	IsNumber,
	IsNotEmpty,
	IsEmail,
	IsArray
} from 'class-validator';

export class AddressDetailsDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
		city: string;
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
		street_name: string;
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
		house_number: string;
	@IsOptional()
	@IsString()
	@ApiProperty()
		phone_number: string;
	@IsOptional()
	@IsString()
	@ApiProperty()
		company: string;
	@IsOptional()
	@IsString()
	@ApiProperty()
		tax_id: string;
}

export class AddressDto {
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		country: string;
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		postal_code: string;
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
		address_type: number;
	@IsNotEmpty()
	@ApiProperty({ type: () => AddressDetailsDto })
	@ValidateNested()
		address_details: AddressDetailsDto
}
