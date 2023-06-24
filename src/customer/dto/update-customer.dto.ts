import { PartialType } from '@nestjs/swagger';
import { CustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CustomerDto) {}
