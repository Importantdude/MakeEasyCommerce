import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { GetProductDto, GetProductShortDto } from './dto/get-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('new')
    @ApiOperation({
        summary: 'Create Product',
        description: 'Create product',
    })
    @ApiBody({
        type: CreateProductDto,
        description: 'product',
        required: true,
    })
    async create(
        @Body() createProductDto: CreateProductDto,
    ): Promise<GetProductDto> {
        return await this.productService.create(createProductDto);
    }

    @Get('get/all')
    @ApiOperation({
        summary: 'Find All Product',
        description: 'Get (specifically) Product data',
    })
    @ApiOkResponse({
        description: 'Product short dto',
        type: [GetProductShortDto],
    })
    async findAll(): Promise<GetProductShortDto[]> {
        return await this.productService.findAll();
    }

    @Get('get/by/:id')
    @ApiOperation({
        summary: 'Product data By Id',
        description: 'Finds Specifically Product data by ID.',
    })
    @ApiOkResponse({
        description: 'Product entity and its details',
        type: GetProductShortDto,
    })
    @ApiParam({ name: 'id', description: 'product id' })
    async findOne(@Param('id') id: string): Promise<GetProductShortDto> {
        return await this.productService.findOne(+id);
    }

    @Patch('update/:id')
    @ApiOperation({
        summary: 'Update Product by id',
        description: 'Update (specifically) product data',
    })
    @ApiBody({
        type: UpdateProductDto,
        description: 'product',
        required: true,
    })
    async update(
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<GetProductShortDto> {
        return await this.productService.update(updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<number> {
        return this.productService.remove(+id);
    }

    @Get('defaultProduct')
    @ApiOperation({
        summary: 'Default Product',
        description: 'Idea is to fetch default (enum) hardcoded Product data',
    })
    @ApiOkResponse({ description: 'Default Product Dto', type: GetProductDto })
    getDefaultProduct() {
        return this.productService.getDefaultProduct();
    }
}
