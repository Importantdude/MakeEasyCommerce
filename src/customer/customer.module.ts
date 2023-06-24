import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { CustomerAddressDetails } from './entities/customer-address-detailed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerAddress, CustomerAddressDetails])],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}