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
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { GetBasketDto } from './dto/get-basket.dto';

@ApiTags('Basket')
@Controller('basket')
export class BasketController {
    constructor(private readonly basketService: BasketService) {}

    @Post('new')
    @ApiOperation({
        summary: 'Create Basket',
        description: 'Create (specifically) basket entity',
    })
    @ApiBody({
        type: CreateBasketDto,
        description: 'Create Basket',
        required: true,
    })
    async create(
        @Body() createBasketDto: CreateBasketDto,
    ): Promise<GetBasketDto> {
        return await this.basketService.create({ createBasketDto });
    }

    // This one in future MUST have option
    // filter by page number and amount on page
    // Most likely this will be separate route
    // But this I'll keep for fun (Once I'll generate 1 million baskets) hehe
    @Get('get/all')
    @ApiOperation({
        summary: 'Find All Baskets',
        description: 'Get data of all Baskets, good luck!',
    })
    @ApiOkResponse({
        description: 'All Basket and theirs details',
        type: [GetBasketDto],
    })
    async findAllBaskets(): Promise<GetBasketDto[]> {
        return await this.basketService.findAll();
    }

    @Get('get/by/:id')
    @ApiOperation({
        summary: 'Find Basket data By Id',
        description: 'Finds All Basket data by ID.',
    })
    @ApiOkResponse({
        description: 'Basket entity and its details',
        type: GetBasketDto,
    })
    @ApiParam({ name: 'id', description: 'Basket id' })
    async findOneBasket(@Param('id') id: string): Promise<GetBasketDto> {
        return await this.basketService.findOne({ id: +id });
    }

    @Patch('update/:id')
    @ApiOperation({
        summary: 'Update Basket by ID',
        description: 'Update specifically basket data by id',
    })
    @ApiBody({
        type: UpdateBasketDto,
        description: 'Basket',
        required: true,
    })
    async updateBasket(
        @Param('id') id: string,
        @Body() updateCustomerDto: UpdateBasketDto,
    ): Promise<GetBasketDto> {
        return await this.basketService.update({
            id: +id,
            updateBasketDto: updateCustomerDto,
        });
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete Basket by ID',
        description: 'Delete specifically basket data by id',
    })
    async removeBasket(@Param('id') id: string): Promise<number> {
        return await this.basketService.remove({ id: +id });
    }

    @Get('defaultBasket')
    @ApiOperation({
        summary: 'Default Basket',
        description: 'Idea is to fetch default (enum) hardcoded Basket data',
    })
    @ApiOkResponse({ description: 'Default Basket Dto', type: GetBasketDto })
    getDefaultBasket() {
        return this.basketService.getDefaultBasket();
    }
}
