import { Injectable } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import {
    GetBasketDto,
    GetBasketProductResponse,
    GetBasketProductsTotalPrice,
} from './dto/get-basket.dto';
import { DefaultOrderBasketDto } from './dto/enum/enum-basket.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
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
            .select('product.id')
            .addSelect('SUM(product.final_price)', 'product_price')
            .where('id IN (:...ids)', {
                ids: createBasketDto.product_ids,
            })
            .groupBy('product.id')
            .getRawMany();

        if (products.length != createBasketDto.product_ids.length) {
            throw 'Basket is empty';
        }

        const customers = await this.entityManager
            .createQueryBuilder(Customer, 'customer')
            .where('id IN (:...ids)', {
                ids: createBasketDto.customer_ids,
            })
            .select('customer.id')
            .getMany();

        if (customers.length != createBasketDto.customer_ids.length) {
            // Should be extended in future
            // 1. In case of guest customer,
            // Should stay empty and filled in order module
            // 2. For "Fast checkout" feature
            // I prefer to inject data to order directly
            // And later after success page to run query to create basket - Disadvantage is that will be problems managing stock
            // Either to add data in basket first
            // Depends if payment will be integrated in basket or in order module
            // Guess is that it will make better performance
            // AND - it's good question
            // --INVESTIGATE--
            // what options are available
            throw 'No Customers assigned to basket';
        }

        const basket_products = await this.getTotalProductPrice(products);
        basket.basket_final_price = basket_products.total_price;
        basket.product_count = basket_products.products_count;

        return await this.entityManager.save(Basket, basket);
    }

    async findAll(): Promise<GetBasketDto[]> {
        try {
            return await this.entityManager
                .getRepository(Basket)
                .createQueryBuilder('basket')
                .getMany();
        } catch (e) {
            return e.message;
        }
    }

    async findOne(id: number): Promise<GetBasketDto> {
        try {
            return await this.entityManager
                .getRepository(Basket)
                .createQueryBuilder('basket')
                .where('basket.id = :id', { id: id })
                .getOneOrFail();
        } catch (e) {
            return e.message;
        }
    }

    async update(
        id: number,
        updateBasketDto: UpdateBasketDto,
    ): Promise<GetBasketDto> {
        const basket = await this.entityManager.preload(Basket, {
            id: id,
            ...updateBasketDto,
        });

        const products = await this.entityManager
            .createQueryBuilder(Product, 'product')
            .select('product.id')
            .addSelect('SUM(product.final_price)', 'product_price')
            .where('id IN (:...ids)', {
                ids: updateBasketDto.product_ids,
            })
            .groupBy('product.id')
            .getRawMany();

        const basket_products = await this.getTotalProductPrice(products);
        basket.basket_final_price = basket_products.total_price;
        basket.product_count = basket_products.products_count;

        return (await this.entityManager.update(Basket, id, basket)).raw;
    }

    async remove(id: number): Promise<number> {
        return (await this.entityManager.delete(Basket, id)).affected;
    }

    private async getTotalProductPrice(
        products: GetBasketProductsTotalPrice[],
    ): Promise<GetBasketProductResponse> {
        return {
            products_count: products.length,
            total_price: products
                .filter((item: { product_price: number }) => item.product_price)
                .reduce(
                    (acc: number, item: { product_price: any }) =>
                        acc + Number(item.product_price),
                    0,
                ),
        };
    }

    async getDefaultBasket(): Promise<GetBasketDto> {
        return {
            id: Number(DefaultOrderBasketDto.id),
            basket_final_price: Number(
                DefaultOrderBasketDto.basket_final_price,
            ),
            product_ids: [Number(DefaultOrderBasketDto.product_ids)],
            customer_ids: [Number(DefaultOrderBasketDto.customer_ids)],
            store_id: Number(DefaultOrderBasketDto.store_id),
            product_count: Number(DefaultOrderBasketDto.product_count),
        };
    }
}
