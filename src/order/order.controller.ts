import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOrderDto } from './dto/get-order.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('new')
    @ApiOperation({
        summary: 'Create Order',
        description: 'Create (specifically) order entity',
    })
    @ApiBody({
        type: CreateOrderDto,
        description: 'Create Order',
        required: true,
    })
    async create(@Body() createOrderDto: CreateOrderDto): Promise<GetOrderDto> {
        return await this.orderService.create({ createOrderDto });
    }

    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @Get('defaultOrder')
    @ApiOperation({
        summary: 'Default Order',
        description: 'Idea is to fetch default (enum) hardcoded Order data',
    })
    @ApiOkResponse({ description: 'Default Order Dto', type: GetOrderDto })
    getDefaultOrder() {
        return this.orderService.getDefaultOrder();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.orderService.update(+id, updateOrderDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderService.remove(+id);
    }
}
