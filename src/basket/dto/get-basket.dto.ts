import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BasketDto } from './create-basket.dto';

// Requires to parameter like "conditions"
// Will be used in future to maintain promo conditions,
// Marketing, cart price/any other rule that suppose
// to affect basket... P.S. personalization

export class GetBasketDto extends BasketDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id: number;
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
