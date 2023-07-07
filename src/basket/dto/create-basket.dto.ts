import { ApiProperty } from '@nestjs/swagger';
import { GetCustomerDto } from '@src/customer/dto/get-customer.dto';
import { GetProductDto } from '@src/product/dto/get-product.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BasketDto {
    @IsNumber()
    @ApiProperty()
    store_id: number;
    // @IsNumber()
    // @ApiProperty()
    product_count: number;
    // @IsNumber()
    // @ApiProperty()
    basket_final_price: number;
    @IsNotEmpty()
    @ApiProperty({ type: ['number'] })
    product_ids: number[];
    @IsNotEmpty()
    @ApiProperty({ type: ['number'] })
    customer_ids: number[];
    // @IsArray()
    // @ApiProperty()
    // personalization: number[];
}

export class CreateBasketDto extends BasketDto {
    products: GetProductDto[];
    customers: GetCustomerDto[];
}
