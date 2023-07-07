import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { BasketDto } from './create-basket.dto';
import { GetProductDto } from '@src/product/dto/get-product.dto';
import { GetCustomerDto } from '@src/customer/dto/get-customer.dto';

// Requires to parameter like "conditions"
// Will be used in future to maintain promo conditions,
// Marketing, cart price/any other rule that suppose
// to affect basket... P.S. personalization

export class GetBasketShortDto extends BasketDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id: number;
}
export class GetBasketDto extends GetBasketShortDto {
    @ApiProperty({ type: () => [GetProductDto] })
    @ValidateNested()
    products: GetProductDto[];
    @ApiProperty({ type: () => [GetCustomerDto] })
    @ValidateNested()
    customers: GetCustomerDto[];
}

export class GetBasketProductsTotalPrice {
    @IsNumber()
    @ApiProperty()
    product_id: number;
    @IsNumber()
    @ApiProperty()
    product_price: number;
}

export class GetBasketProductResponse {
    @IsNumber()
    @ApiProperty()
    products_count: number;
    @IsNumber()
    @ApiProperty()
    total_price: number;
}
