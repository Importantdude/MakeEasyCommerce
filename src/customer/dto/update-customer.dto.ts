import { ApiProperty } from '@nestjs/swagger';
import { CustomerDto } from './create-customer.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCustomerDto extends CustomerDto {}

export class UpdateCustomerAddressDto extends CustomerDto {
    @ApiProperty({ type: [Number] })
    @IsNotEmpty()
    address_ids: number[];
}
