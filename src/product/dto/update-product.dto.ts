import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductDto extends ProductDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id: number;
}
