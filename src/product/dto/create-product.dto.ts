import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { type } from 'os';

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    sku: string;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    product_type: number;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    visibility: number;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    quantity: number;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    final_price: number;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    store_id: number;
}

export class CreateProductDto extends ProductDto {}
