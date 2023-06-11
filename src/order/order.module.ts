import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { BasketService } from 'src/basket/basket.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, BasketService, UserService]
})
export class OrderModule {}
