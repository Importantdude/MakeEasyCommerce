import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetCustomerDto } from './dto/get-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('')
	@ApiOperation({ summary: 'Create Customer', description: 'Create customer' })
	@ApiBody({ type: CreateCustomerDto, description: 'customer', required: true })
  async create(@Body() CreateCustomerDto: CreateCustomerDto): Promise<GetCustomerDto> {
    return await this.customerService.create(CreateCustomerDto);
  }

  @Get('')
	@ApiOperation({ summary: 'Customer', description: 'Get All Customers data' })
	@ApiOkResponse({ description: 'Customer Dto', type: GetCustomerDto })
  async findAll(): Promise<GetCustomerDto[]> {
    return await this.customerService.findAll();
  }

  @Get('defaultCustomer')
	@ApiOperation({ summary: 'Default Customer', description: 'Idea was to fetch default (enum) hardcoded customer data' })
	@ApiOkResponse({ description: 'Default Customer Dto', type: GetCustomerDto })
  getDefaultCustomer() {
    return this.customerService.getDefaultCustomer();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find Customer By Id', description: 'Finds All Customer data by ID.' })
	@ApiParam({ name: 'id', description: 'customer id' })
  async findOne(@Param('id') id: string): Promise<GetCustomerDto> {
    return await this.customerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
