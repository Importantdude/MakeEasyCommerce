import { Injectable } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { GetBasketDto } from './dto/get-basket.dto';
import { DefaultOrderBasketDto } from './dto/enum/enum-basket.dto';
import { DefaultOrderProductDto } from 'src/product/dto/enum/enum-product.dto';
import { DefaultOrderCustomerDto } from 'src/customer/dto/enum/enum-customer.dto';

@Injectable()
export class BasketService {
  create(createBasketDto: CreateBasketDto) {
    return 'This action adds a new basket';
  }

  findAll() {
    return `This action returns all basket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} basket`;
  }

  async getDefaultBasket(): Promise<GetBasketDto> {
    return {
      basket_id: DefaultOrderBasketDto.basket_id,
      basket_total_price: DefaultOrderBasketDto.basket_total_price,
      products: [
        {
          product_id: Number(DefaultOrderProductDto.product_id),
          total_price: Number(DefaultOrderProductDto.final_price)
        }
      ],
      customer: [
        {
          id: Number(DefaultOrderCustomerDto.id),
          first_name: null,
          last_name: null,
          email: null,
          store_id: null
        }
      ]
    }
  }

  update(id: number, updateBasketDto: UpdateBasketDto) {
    return `This action updates a #${id} basket`;
  }

  remove(id: number) {
    return `This action removes a #${id} basket`;
  }
}
