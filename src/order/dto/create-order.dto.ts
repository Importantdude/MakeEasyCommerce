import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { GetBasketDto } from "src/basket/dto/get-basket.dto";
import { AddressDto } from "src/customer/dto/address/customer-address.dto";

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
    @ApiProperty({ type: () => AddressDto })
	@ValidateNested()
		shipping_address: AddressDto[];
    @IsNotEmpty()
    @ApiProperty({ type: () => AddressDto })
    @ValidateNested()
        payment_address: AddressDto[];
}

export class CreateOrderDto extends OrderDto {}