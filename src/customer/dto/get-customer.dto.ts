import { ApiProperty } from '@nestjs/swagger';
import { CustomerDto } from './create-customer.dto';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { GetAddressDetailsDto, GetAddressDto } from './address/get-address.dto';

export class GetCustomerDto extends CustomerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class GetCustomerAddressDto extends GetCustomerDto {
    @ApiProperty({ type: [GetAddressDto] })
    @ValidateNested()
    address: GetAddressDto[];
}

export class GetCustomerAddressDetailsDto extends GetCustomerDto {
    @ApiProperty({ type: [GetAddressDetailsDto] })
    @ValidateNested()
    address: GetAddressDetailsDto[];
}
