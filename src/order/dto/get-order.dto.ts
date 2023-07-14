import { IsNotEmpty, IsNumber } from 'class-validator';
import { OrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GetCustomerDto } from '@src/customer/dto/get-customer.dto';
import { GetBasketDto } from '@src/basket/dto/get-basket.dto';

export class GetOrderShortDto extends OrderDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id: number;
}

export class GetOrderDto extends GetOrderShortDto {
    baskets: GetBasketDto[];
    customers: GetCustomerDto[];
}
