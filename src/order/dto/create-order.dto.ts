import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { GetBasketDto } from 'src/basket/dto/get-basket.dto';
import { AddressDto } from 'src/customer/dto/address/customer-address.dto';

export class OrderDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    order_type: number;
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    order_status: number;
    @IsNotEmpty()
    @ApiProperty({ type: () => [Number] })
    @ValidateNested()
    basket_ids: number[];
    @IsNotEmpty()
    @ApiProperty({ type: () => [Number] })
    @ValidateNested()
    address_ids: number[];
}

export class CreateOrderDto extends OrderDto {}
