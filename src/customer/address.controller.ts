import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetCustomerAddressDto, GetCustomerAddressShortDto, GetCustomerDto, GetCustomerShortDto } from './dto/get-customer.dto';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly customerService: CustomerService) {}

  // @Post('new')
	// @ApiOperation({ summary: 'Create Customer', description: 'Create customer' })
	// @ApiBody({ type: CreateCustomerDto, description: 'customer', required: true })
  // async create(@Body() CreateCustomerDto: CreateCustomerDto): Promise<GetCustomerDto> {
  //   return await this.customerService.create(CreateCustomerDto);
  // }

  @Get('get/short/by/:id')
  @ApiOperation({ summary: 'Find Address short dto By Id', description: 'Finds specifically Address data by ID.' })
	@ApiOkResponse({ description: 'Address short dto', type: GetCustomerAddressShortDto })
	@ApiParam({ name: 'id', description: 'address id' })
  async findOneAddressShort(@Param('id') id: string): Promise<GetCustomerAddressShortDto> {
    return await this.customerService.findOneAddressShort(+id);
  }

  @Get('get/short/all')
	@ApiOperation({ summary: 'Find All Addresses short dto', description: 'Get specifically Addresses data' })
	@ApiOkResponse({ description: 'Addresses short Dto', type: [GetCustomerAddressShortDto] })
  async findAllAddresses(): Promise<GetCustomerAddressShortDto[]> {
    return await this.customerService.findAllAddresses();
  }

  @Get('get/detailed/by/:id')
  @ApiOperation({ summary: 'Find Address detailed dto By Id', description: 'Finds Full Address data by ID.' })
	@ApiOkResponse({ description: 'Address detailed dto', type: GetCustomerAddressDto })
	@ApiParam({ name: 'id', description: 'address id' })
  async findOneDetailedAddresses(@Param('id') id: string): Promise<GetCustomerAddressDto> {
    return await this.customerService.findOneAddressDetailed(+id);
  }

  @Get('get/detailed/all')
	@ApiOperation({ summary: 'Detailed Addresses', description: 'Get Full Address data' })
	@ApiOkResponse({ description: 'All Addresses and its details', type: [GetCustomerAddressDto] })
  async findAllDetailedAddresses(): Promise<GetCustomerAddressDto[]> {
    return await this.customerService.findAllDetailedAddresses();
  }

  // @Patch('update/:id')
	// @ApiOperation({ summary: 'Update Customer', description: 'Update customer' })
	// @ApiBody({ type: UpdateCustomerDto, description: 'customer', required: true })
  // async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<GetCustomerDto> {
  //   return await this.customerService.update(+id, updateCustomerDto);
  // }

  // @Patch('update/address')
  // @ApiOperation({ summary: 'Update Customer Address', description: 'Update customer address' })
	// @ApiBody({ type: [UpdateCustomerAddressDto], description: 'customer_address', required: true })
  // async updateCustomerAddress(@Body() updateCustomerAddressDto: UpdateCustomerAddressDto[]): Promise<GetCustomerAddressDto[]> {
  //   return await this.customerService.updateCustomerAddress(updateCustomerAddressDto);
  // }

  // @Delete('/delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.customerService.remove(+id);
  // }

  // @Delete('/delete/:id')
  // removeAddress(@Param('id') id: string) {
  //   return this.customerService.remove(+id);
  // }
}