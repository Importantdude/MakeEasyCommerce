import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBasketDto } from './dto/get-basket.dto';

@ApiTags('Basket')
@Controller('basket')
export class BasketController {
    constructor(private readonly basketService: BasketService) {}

    @Post()
    create(@Body() createBasketDto: CreateBasketDto) {
        return this.basketService.create(createBasketDto);
    }

    @Get()
    findAll() {
        return this.basketService.findAll();
    }

    // @Get('defaultBasket')
    // @ApiOperation({
    //     summary: 'Default Basket',
    //     description: 'Idea is to fetch default (enum) hardcoded Basket data',
    // })
    // @ApiOkResponse({ description: 'Default Basket Dto', type: GetBasketDto })
    // getDefaultBasket() {
    //     return this.basketService.getDefaultBasket();
    // }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.basketService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBasketDto: UpdateBasketDto) {
        return this.basketService.update(+id, updateBasketDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.basketService.remove(+id);
    }
}
