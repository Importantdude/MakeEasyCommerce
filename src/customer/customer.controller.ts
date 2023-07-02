import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerAddressDto, UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetCustomerAddressDto, GetCustomerAddressShortDto, GetCustomerDto, GetCustomerShortDto } from './dto/get-customer.dto';

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

  @Get('get/short/by/:id')
  @ApiOperation({ summary: 'Find Customer short dto By Id', description: 'Finds specifically Customer data by ID.' })
	@ApiOkResponse({ description: 'Customer short dto', type: GetCustomerShortDto })
	@ApiParam({ name: 'id', description: 'customer id' })
  async findOneShort(@Param('id') id: string): Promise<GetCustomerShortDto> {
    return await this.customerService.findOneShort(+id);
  }

  @Get('get/short/all')
	@ApiOperation({ summary: 'Find All Customers', description: 'Get specifically Customers data' })
	@ApiOkResponse({ description: 'Customers short dto', type: [GetCustomerShortDto] })
  async findAll(): Promise<GetCustomerShortDto[]> {
    return await this.customerService.findAllCustomers();
  }

  @Get('get/detailed/by/:id')
  @ApiOperation({ summary: 'Find Detailed Customer By Id', description: 'Finds All Customer data by ID.' })
	@ApiOkResponse({ description: 'Customer entity and its details', type: GetCustomerDto })
	@ApiParam({ name: 'id', description: 'customer id' })
  async findOne(@Param('id') id: string): Promise<GetCustomerDto> {
    return await this.customerService.findOne(+id);
  }

  @Get('get/detailed/all')
	@ApiOperation({ summary: 'Detailed Customers Data', description: 'Get Full Customer data' })
	@ApiOkResponse({ description: 'All Customers and theirs details', type: [GetCustomerDto] })
  async findAllDetailedCustomers(): Promise<GetCustomerDto[]> {
    return await this.customerService.findAllDetailedCustomers();
  }

  @Get('get/address/short/by/:id')
  @ApiOperation({ summary: 'Find Address short dto By Id', description: 'Finds specifically Address data by ID.' })
	@ApiOkResponse({ description: 'Address short dto', type: GetCustomerAddressShortDto })
	@ApiParam({ name: 'id', description: 'address id' })
  async findOneAddressShort(@Param('id') id: string): Promise<GetCustomerAddressShortDto> {
    return await this.customerService.findOneAddressShort(+id);
  }

  @Get('get/addresses/short/all')
	@ApiOperation({ summary: 'Find All Addresses short dto', description: 'Get specifically Addresses data' })
	@ApiOkResponse({ description: 'Addresses short Dto', type: [GetCustomerAddressShortDto] })
  async findAllAddresses(): Promise<GetCustomerAddressShortDto[]> {
    return await this.customerService.findAllAddresses();
  }

  @Get('get/address/detailed/by/:id')
  @ApiOperation({ summary: 'Find Address detailed dto By Id', description: 'Finds Full Address data by ID.' })
	@ApiOkResponse({ description: 'Address detailed dto', type: GetCustomerAddressDto })
	@ApiParam({ name: 'id', description: 'address id' })
  async findOneDetailedAddresses(@Param('id') id: string): Promise<GetCustomerAddressDto> {
    return await this.customerService.findOneAddressDetailed(+id);
  }

  @Get('get/addresses/detailed/all')
	@ApiOperation({ summary: 'Detailed Addresses', description: 'Get Full Address data' })
	@ApiOkResponse({ description: 'All Addresses and its details', type: [GetCustomerAddressDto] })
  async findAllDetailedAddresses(): Promise<GetCustomerAddressDto[]> {
    return await this.customerService.findAllDetailedAddresses();
  }

  @Get('get/defaultCustomer')
	@ApiOperation({ summary: 'Default Customer', description: 'Idea was to fetch default (enum) hardcoded customer data' })
	@ApiOkResponse({ description: 'Default Customer Dto', type: GetCustomerDto })
  getDefaultCustomer() {
    return this.customerService.getDefaultCustomer();
  }

  @Patch('update/:id')
	@ApiOperation({ summary: 'Update Customer', description: 'Update customer' })
	@ApiBody({ type: UpdateCustomerDto, description: 'customer', required: true })
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<GetCustomerDto> {
    return await this.customerService.update(+id, updateCustomerDto);
  }

  @Patch('update/address')
  @ApiOperation({ summary: 'Update Customer Address', description: 'Update customer address' })
	@ApiBody({ type: [UpdateCustomerAddressDto], description: 'customer_address', required: true })
  async updateCustomerAddress(@Body() updateCustomerAddressDto: UpdateCustomerAddressDto[]): Promise<GetCustomerAddressDto[]> {
    return await this.customerService.updateCustomerAddress(updateCustomerAddressDto);
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
