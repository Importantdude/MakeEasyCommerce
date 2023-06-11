import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { BasketDto } from "./create-basket.dto";

// Requires to parameter like "conditions"
// Will be used in future to maintain promo conditions, 
// Marketing, cart price/any other rules that supposed
// to affect final price

export class GetBasketDto extends PartialType(BasketDto) {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
        basket_id: number;
}