import { Injectable } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { GetBasketDto } from './dto/get-basket.dto';
import { DefaultOrderBasketDto } from './dto/enum/enum-basket.dto';
import { DefaultOrderProductDto } from 'src/product/dto/enum/enum-product.dto';
import { DefaultOrderCustomerDto } from 'src/customer/dto/enum/enum-customer.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { Basket } from './entities/basket.entity';
import { Product } from '@src/product/entities/product.entity';
import { Customer } from '@src/customer/entities/customer.entity';

@Injectable()
export class BasketService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    async create(createBasketDto: CreateBasketDto): Promise<GetBasketDto> {
        const basket = this.entityManager.create(Basket, createBasketDto);
        const products = await this.entityManager
            .createQueryBuilder(Product, 'product')
            .where('id IN (:...ids)', {
                ids: createBasketDto.product_ids,
            })
            .select('product.id')
            .getMany();

        if (products.length != createBasketDto.product_ids.length) {
            return null;
        }

        const customers = await this.entityManager
            .createQueryBuilder(Customer, 'customer')
            .where('id IN (:...ids)', {
                ids: createBasketDto.customer_ids,
            })
            .select('customer.id')
            .getMany();

        if (customers.length != createBasketDto.customer_ids.length) {
            return null;
        }

        return await this.entityManager.save(Basket, basket);
    }

    findAll() {
        return `This action returns all basket`;
    }

    findOne(id: number) {
        return `This action returns a #${id} basket`;
    }

    // async getDefaultBasket(): Promise<GetBasketDto> {
    //     return {
    //         basket_id: DefaultOrderBasketDto.basket_id,
    //         basket_total_price: DefaultOrderBasketDto.basket_total_price,
    //         products: [
    //             {
    //                 product_id: Number(DefaultOrderProductDto.product_id),
    //                 total_price: Number(DefaultOrderProductDto.final_price),
    //             },
    //         ],
    //         customer: [
    //             {
    //                 id: Number(DefaultOrderCustomerDto.id),
    //                 first_name: null,
    //                 last_name: null,
    //                 email: null,
    //                 store_id: null,
    //             },
    //         ],
    //     };
    // }

    update(id: number, updateBasketDto: UpdateBasketDto) {
        return `This action updates a #${id} basket`;
    }

    remove(id: number) {
        return `This action removes a #${id} basket`;
    }
}
