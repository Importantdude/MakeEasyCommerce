import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    ValidateNested,
    IsNumber,
    IsNotEmpty,
} from 'class-validator';

export class AddressDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    address_type: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    postal_code: string;
}

export class DetailsDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    city: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    street_name: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    house_number: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone_number: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    company: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tax_id: string;
}

export class CreateAddressDto extends AddressDto {
    @ApiProperty({ type: DetailsDto })
    @ValidateNested()
    details: DetailsDto;
}
