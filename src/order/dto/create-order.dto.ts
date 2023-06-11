import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { GetBasketDto } from "src/basket/dto/get-basket.dto";
import { UserDto } from "src/user/dto/create-user.dto";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        order_type: string
    @IsNotEmpty()
    @ApiProperty({ type: () => CreateAddressDto })
	@ValidateNested()
		shipping_address: CreateAddressDto[];
    @IsNotEmpty()
    @ApiProperty({ type: () => CreateAddressDto })
    @ValidateNested()
        payment_address: CreateAddressDto[];
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ type: () => GetBasketDto })
    @ValidateNested()
        basket: GetBasketDto[];
}

export class CreateAddressDto {
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ type: () => UserDto })
    @ValidateNested()
        user: UserDto[];
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		city: string;
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		zipCode: string;
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		streetName: string;
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		houseNumber: string;
    @IsOptional()
    @IsString()
	@ApiProperty()
		phoneNumber: string;
    @IsOptional()
    @IsString()
    @ApiProperty()
        company: string;
}
