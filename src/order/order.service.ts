import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { DefaultOrderDto } from './dto/enum/enum-order.dto';
import { BasketService } from 'src/basket/basket.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderService {

  constructor(
    private readonly basketService: BasketService,
    private readonly userService: UserService
  ){}

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  
  async getDefaultOrder(): Promise<GetOrderDto> {
    const basket = await this.basketService.getDefaultBasket();
    const address = await this.userService.getDefaultUserAddress();

    return {
      order_type: DefaultOrderDto.order_type.toString(),
      basket: [basket],
      shipping_address: [address],
      payment_address: [address]
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
