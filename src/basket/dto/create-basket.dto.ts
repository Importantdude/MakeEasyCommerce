import { ApiProperty, PartialType } from '@nestjs/swagger';
import { GetBasketCustomerDto } from '@src/customer/dto/get-customer.dto';
import { GetBasketProductDto } from '@src/product/dto/get-product.dto';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class BasketDto {
    @IsNumber()
    @ApiProperty()
    store_id: number;
    @IsNumber()
    @ApiProperty()
    product_count: number;
    @IsNumber()
    @ApiProperty()
    basket_final_price: number;
    // @IsNumber()
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

export class CreateBasketDto extends BasketDto {}
