import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOrderDto extends CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id: number;
}
