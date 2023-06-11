import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { GetProductBasketDto } from "src/product/dto/get-product.dto";
import { UserShortDto } from "src/user/dto/get-user.dto";

export class BasketDto {
    @IsNotEmpty()
    @ApiProperty({ type: () => GetProductBasketDto })
	@ValidateNested()
		products: GetProductBasketDto[];
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
        basket_total_price: number;
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ type: () => UserShortDto })
    @ValidateNested()
        user: UserShortDto[];
}

export class CreateBasketDto extends PartialType(BasketDto){}
