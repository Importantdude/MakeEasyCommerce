import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProductDto {
	@IsString()
    @IsNotEmpty()
	@ApiProperty()
		sku: string;
    @IsBoolean()
    @IsNotEmpty()
	@ApiProperty()
		visibility: boolean;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
        qty: number;
	@IsDecimal()
    @IsNotEmpty()
	@ApiProperty()
		final_price: number;
}

export class CreateProductDto extends PartialType(ProductDto) {}