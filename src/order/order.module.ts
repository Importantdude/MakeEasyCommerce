import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
// import { BasketService } from 'src/basket/basket.service';
// import { CustomerService } from 'src/customer/customer.service';

@Module({
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
