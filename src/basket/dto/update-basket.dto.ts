import { GetCustomerDto } from '@src/customer/dto/get-customer.dto';
import { BasketDto } from './create-basket.dto';
import { GetProductDto } from '@src/product/dto/get-product.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBasketDto extends BasketDto {
    products: GetProductDto[];
    customers: GetCustomerDto[];
}

export class UpdateBasket {
    @IsNumber()
    @ApiProperty()
    id: number;
    @IsNumber()
    @ApiProperty()
    store_id: number;
    @IsNumber()
    @ApiProperty()
    product_count: number;
    @IsNumber()
    @ApiProperty()
    basket_final_price: number;
    products: GetProductDto[];
    customers: GetCustomerDto[];
}
