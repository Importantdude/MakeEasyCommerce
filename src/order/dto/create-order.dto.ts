import { ApiProperty } from '@nestjs/swagger';
import { GetCustomerDto } from '@src/customer/dto/get-customer.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { GetBasketDto } from 'src/basket/dto/get-basket.dto';

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
    baskets_ids: number[];
    @IsNotEmpty()
    @ApiProperty({ type: () => [Number] })
    customers_ids: number[];
}

export class CreateOrderDto extends OrderDto {
    baskets: GetBasketDto[];
    customers: GetCustomerDto[];
}
