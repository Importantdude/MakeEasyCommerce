import { ApiProperty } from '@nestjs/swagger';
import { CustomerDto } from './create-customer.dto';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { UpdateAddressDetailsDto } from './address/update-address.dto';

export class UpdateCustomerDto extends CustomerDto {}

export class UpdateCustomerAddressDto extends CustomerDto {
    @ApiProperty({ type: [Number] })
    @IsNotEmpty()
    address_ids: number[];
}

export class UpdateCustomerAddressDetailsDto extends CustomerDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    id: number;
    @ApiProperty({ type: [Number] })
    @IsOptional()
    address_ids: number[];
    @ApiProperty({ type: [UpdateAddressDetailsDto] })
    @IsOptional()
    @ValidateNested()
    address: UpdateAddressDetailsDto[];
}

export class DeleteCustomerAddressRelation {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    id: number;
    @ApiProperty({ type: [Number] })
    @IsNotEmpty()
    address_ids: number[];
}
