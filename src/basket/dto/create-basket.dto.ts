import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { GetProductBasketDto } from 'src/product/dto/get-product.dto';
import { GetCustomerShortDto } from 'src/customer/dto/get-customer.dto';

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
    @ApiProperty({ type: () => GetCustomerShortDto })
    @ValidateNested()
    customer: GetCustomerShortDto[];
}

export class CreateBasketDto extends PartialType(BasketDto) {}
