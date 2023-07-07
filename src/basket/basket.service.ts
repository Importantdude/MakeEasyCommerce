import { Injectable } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { GetBasketDto, GetBasketProductResponse } from './dto/get-basket.dto';
import { DefaultOrderBasketDto } from './dto/enum/enum-basket.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Basket } from './entities/basket.entity';
import { Product } from '@src/product/entities/product.entity';
import { Customer } from '@src/customer/entities/customer.entity';
import { GetProductDto } from '@src/product/dto/get-product.dto';

@Injectable()
export class BasketService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    async create(createBasketDto: CreateBasketDto): Promise<GetBasketDto> {
        const products: GetProductDto[] = await this.entityManager
            .createQueryBuilder(Product, 'product')
            .select()
            .where('id IN (:...ids)', {
                ids: createBasketDto.product_ids,
            })
            .groupBy('product.id')
            .getMany();

        const productIds: number[] = products.map((el) => {
            return el.id;
        });

        if (productIds.length != createBasketDto.product_ids.length) {
            throw 'Basket is empty';
        }

        const customers = await this.entityManager
            .createQueryBuilder(Customer, 'customer')
            .where('id IN (:...ids)', {
                ids: createBasketDto.customer_ids,
            })
            .getMany();

        if (customers.length != createBasketDto.customer_ids.length) {
            // Should be extended in future
            // 1. In case of guest customer,
            // Should stay empty and filled in order module
            // 2. For "Fast checkout" feature
            // Either to add data in basket first
            // Depends if payment will be integrated in basket or in order module
            // I guess that it will bring better performance
            // AND - it's good question :D
            // --INVESTIGATE--
            // what options are available
            throw 'No Customers assigned to basket';
        }

        const basket: CreateBasketDto = {
            products: products,
            customers: customers,
            ...this.entityManager.create(Basket, createBasketDto),
        };

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
                .leftJoinAndSelect('basket.products', 'products')
                .leftJoinAndSelect('basket.customers', 'customers')
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
        const current = await this.findOne(id);

        const products: GetProductDto[] = await this.entityManager
            .createQueryBuilder(Product, 'product')
            .where('id IN (:...ids)', {
                ids: updateBasketDto.product_ids,
            })
            .groupBy('product.id')
            .getMany();

        if (products.length > 0) {
            await this.entityManager
                .getRepository(Basket)
                .createQueryBuilder('basket')
                .relation(Basket, 'products')
                .of(id)
                .addAndRemove(products, current.products);
        }

        const customers = await this.entityManager
            .createQueryBuilder(Customer, 'customer')
            .where('id IN (:...ids)', {
                ids: updateBasketDto.customer_ids,
            })
            .getMany();

        if (customers.length > 0) {
            await this.entityManager
                .getRepository(Basket)
                .createQueryBuilder('basket')
                .relation(Basket, 'customers')
                .of(id)
                .addAndRemove(customers, current.customers);
        }

        const basket_products = await this.getTotalProductPrice(products);
        const basket = {
            basket_final_price: basket_products.total_price,
            product_count: basket_products.products_count,
            store_id: updateBasketDto.store_id,
        };

        console.log(basket);
        try {
            await this.entityManager
                .getRepository(Basket)
                .createQueryBuilder('basket')
                .update()
                .set(basket)
                .where('basket.id = :id', { id: id })
                .execute();

            return await this.findOne(id);
        } catch (e) {
            return e.message;
        }
    }

    async remove(id: number): Promise<number> {
        return (await this.entityManager.delete(Basket, id)).affected;
    }

    private async trimObjectValuesByKey(
        obj: any,
        keysToTrim: string[],
    ): Promise<any> {
        for (const [key, value] of Object.entries(obj)) {
            if (keysToTrim.includes(key) && typeof value === 'string') {
                obj[key] = value.trim();
            } else if (typeof value === 'object') {
                this.trimObjectValuesByKey(value, keysToTrim);
            }
        }
        return obj;
    }

    private async getTotalProductPrice(
        products: GetProductDto[],
    ): Promise<GetBasketProductResponse> {
        return {
            products_count: products.length,
            total_price: products
                .filter((item) => item.final_price)
                .reduce(
                    (acc: number, item: { final_price: any }) =>
                        acc + Number(item.final_price),
                    0,
                ),
        };
    }

    private async getDuplicatedIds(ids: number[]) {
        // const duplicates = await this.getDuplicatedIds(
        //     updateBasketDto.product_ids,
        // );

        // const filter_duplicated = updateBasketDto.product_ids.filter(
        //     (e) => duplicates[e],
        // );

        return ids.reduce<{ [key: number]: number }>((a, e) => {
            a[e] = ++a[e] || 0;
            return a;
        }, {});
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
            products: null,
            customers: null,
        };
    }
}
