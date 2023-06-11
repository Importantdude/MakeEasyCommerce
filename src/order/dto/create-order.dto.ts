import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { GetBasketDto } from "src/basket/dto/get-basket.dto";
import { UserAddressDto } from "src/user/dto/create-user.dto";

export class OrderDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        order_type: string
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ type: () => GetBasketDto })
    @ValidateNested()
        basket: GetBasketDto[];
    @IsNotEmpty()
    @ApiProperty({ type: () => UserAddressDto })
	@ValidateNested()
		shipping_address: UserAddressDto[];
    @IsNotEmpty()
    @ApiProperty({ type: () => UserAddressDto })
    @ValidateNested()
        payment_address: UserAddressDto[];
}

export class CreateOrderDto extends OrderDto {}