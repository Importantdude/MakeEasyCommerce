import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCustomerDto } from './dto/get-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('')
  async create(@Body() CreateCustomerDto: CreateCustomerDto): Promise<GetCustomerDto> {
    return await this.customerService.create(CreateCustomerDto);
  }

  @Get('')
  findAll() {
    return this.customerService.findAll();
  }

  @Get('defaultCustomer')
	@ApiOperation({ summary: 'Default Customer', description: 'Idea is to fetch default (enum) hardcoded customer data' })
	@ApiOkResponse({ description: 'Default Customer Dto', type: GetCustomerDto })
  getDefaultCustomer() {
    return this.customerService.getDefaultCustomer();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
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
