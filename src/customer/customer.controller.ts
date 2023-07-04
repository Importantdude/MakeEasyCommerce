import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { GetCustomerDto, GetCustomerShortDto } from './dto/get-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post('new')
    @ApiOperation({
        summary: 'Create Customer',
        description: 'Create customer',
    })
    @ApiBody({
        type: CreateCustomerDto,
        description: 'customer',
        required: true,
    })
    async create(
        @Body() CreateCustomerDto: CreateCustomerDto,
    ): Promise<GetCustomerDto> {
        return await this.customerService.create(CreateCustomerDto);
    }

    @Get('get/short/by/:id')
    @ApiOperation({
        summary: 'Find Customer short dto By Id',
        description: 'Finds specifically Customer data by ID.',
    })
    @ApiOkResponse({
        description: 'Customer short dto',
        type: GetCustomerShortDto,
    })
    @ApiParam({ name: 'id', description: 'customer id' })
    async findOneShort(@Param('id') id: string): Promise<GetCustomerShortDto> {
        return await this.customerService.findOneShort(+id);
    }

    @Get('get/short/all')
    @ApiOperation({
        summary: 'Find All Customers',
        description: 'Get specifically Customers data',
    })
    @ApiOkResponse({
        description: 'Customers short dto',
        type: [GetCustomerShortDto],
    })
    async findAll(): Promise<GetCustomerShortDto[]> {
        return await this.customerService.findAllCustomers();
    }

    @Get('get/detailed/by/:id')
    @ApiOperation({
        summary: 'Find Detailed Customer By Id',
        description: 'Finds All Customer data by ID.',
    })
    @ApiOkResponse({
        description: 'Customer entity and its details',
        type: GetCustomerDto,
    })
    @ApiParam({ name: 'id', description: 'customer id' })
    async findOne(@Param('id') id: string): Promise<GetCustomerDto> {
        return await this.customerService.findOne(+id);
    }

    @Get('get/detailed/all')
    @ApiOperation({
        summary: 'Detailed Customers Data',
        description: 'Get Full Customer data',
    })
    @ApiOkResponse({
        description: 'All Customers and theirs details',
        type: [GetCustomerDto],
    })
    async findAllDetailedCustomers(): Promise<GetCustomerDto[]> {
        return await this.customerService.findAllDetailedCustomers();
    }

    @Get('get/defaultCustomer')
    @ApiOperation({
        summary: 'Default Customer',
        description: 'Idea was to fetch default (enum) hardcoded customer data',
    })
    @ApiOkResponse({
        description: 'Default Customer Dto',
        type: GetCustomerDto,
    })
    getDefaultCustomer() {
        return this.customerService.getDefaultCustomer();
    }

    @Patch('update/:id')
    @ApiOperation({
        summary: 'Update Customer',
        description: 'Update customer',
    })
    @ApiBody({
        type: UpdateCustomerDto,
        description: 'customer',
        required: true,
    })
    async update(
        @Param('id') id: string,
        @Body() updateCustomerDto: UpdateCustomerDto,
    ): Promise<GetCustomerDto> {
        return await this.customerService.update(+id, updateCustomerDto);
    }

    @Delete('delete/:id')
    remove(@Param('id') id: string) {
        return this.customerService.remove(+id);
    }
}
