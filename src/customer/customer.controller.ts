import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerAddressDto, UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetCustomerAddressDto, GetCustomerDto } from './dto/get-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('new')
	@ApiOperation({ summary: 'Create Customer', description: 'Create customer' })
	@ApiBody({ type: CreateCustomerDto, description: 'customer', required: true })
  async create(@Body() CreateCustomerDto: CreateCustomerDto): Promise<GetCustomerDto> {
    return await this.customerService.create(CreateCustomerDto);
  }

  @Get('find/All')
	@ApiOperation({ summary: 'Customer', description: 'Get All Customers data' })
	@ApiOkResponse({ description: 'Customer Dto', type: GetCustomerDto })
  async findAll(): Promise<GetCustomerDto[]> {
    return await this.customerService.findAll();
  }

  @Get('find/defaultCustomer')
	@ApiOperation({ summary: 'Default Customer', description: 'Idea was to fetch default (enum) hardcoded customer data' })
	@ApiOkResponse({ description: 'Default Customer Dto', type: GetCustomerDto })
  getDefaultCustomer() {
    return this.customerService.getDefaultCustomer();
  }

  @Get('find/:id')
  @ApiOperation({ summary: 'Find Customer By Id', description: 'Finds All Customer data by ID.' })
	@ApiParam({ name: 'id', description: 'customer id' })
  async findOne(@Param('id') id: string): Promise<GetCustomerDto> {
    return await this.customerService.findOne(+id);
  }

  @Patch('update/:id')
	@ApiOperation({ summary: 'Update Customer', description: 'Update customer' })
	@ApiBody({ type: UpdateCustomerDto, description: 'customer', required: true })
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<GetCustomerDto> {
    return await this.customerService.update(+id, updateCustomerDto);
  }

  @Patch('update/address/:customer_id')
  @ApiOperation({ summary: 'Update Customer Address', description: 'Update customer address' })
	@ApiBody({ type: [UpdateCustomerAddressDto], description: 'customer_address', required: true })
  async updateCustomerAddress(@Param('customer_id') id: number, @Body() updateCustomerAddressDto: UpdateCustomerAddressDto[]): Promise<GetCustomerAddressDto[]> {
    return await this.customerService.updateCustomerAddress(+id, updateCustomerAddressDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }

  @Delete('/delete/address/:id')
  removeAddress(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
