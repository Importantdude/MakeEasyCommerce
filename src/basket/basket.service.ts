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
import { GetCustomerDto } from '@src/customer/dto/get-customer.dto';
import { BasketShort } from './basket.interface';

@Injectable()
export class BasketService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    async create({
        createBasketDto,
    }: {
        createBasketDto: CreateBasketDto;
    }): Promise<GetBasketDto> {
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

        if (createBasketDto.customer_ids.length > 0) {
            const customers = await this.entityManager
                .createQueryBuilder(Customer, 'customer')
                .where('id IN (:...ids)', {
                    ids: createBasketDto.customer_ids,
                })
                .getMany();

            const basket: CreateBasketDto = {
                products: products,
                customers: customers,
                ...this.entityManager.create(Basket, createBasketDto),
            };

            const validateBasketData = await this.validateBasketData({
                store_id: createBasketDto.store_id,
                products,
            });

            basket.basket_final_price = validateBasketData.basket_final_price;
            basket.product_count = validateBasketData.product_count;
            return await this.entityManager.save(Basket, basket);
        }

        const basket: CreateBasketDto = {
            products: products,
            customers: null,
            ...this.entityManager.create(Basket, createBasketDto),
        };

        const validateBasketData = await this.validateBasketData({
            store_id: createBasketDto.store_id,
            products,
        });

        basket.basket_final_price = validateBasketData.basket_final_price;
        basket.product_count = validateBasketData.product_count;
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

    async findOne({ id }: { id: number }): Promise<GetBasketDto> {
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

    async update({
        id,
        updateBasketDto,
    }: {
        id: number;
        updateBasketDto: UpdateBasketDto;
    }): Promise<GetBasketDto> {
        const current = await this.findOne({ id });

        const products: GetProductDto[] = await this.findProductsByIds({
            itemIds: updateBasketDto.product_ids,
            selectValues: null,
            relationAlias: 'product',
            groupBy: 'id',
        });

        // IMPORTANT START

        // I want to do speed test using Promise.all()
        // Current understanding tells me that if there
        // will be smth in return I won't spend time on loading
        // customer entities later cuz they might will work
        // in parallel request in Promise.all

        // Also can be implemented for updating relations
        // In case if in same function exists more then 1
        // await this.updateBasketRelations

        // IMPORTANT END
        // const test = await Promise.all([
        //     await this.findProductsByIds({
        //         itemIds: updateBasketDto.product_ids,
        //         selectValues: null,
        //         relationAlias: 'product',
        //         groupBy: 'id',
        //     }),
        //     await this.findCustomersByIds({
        //         itemIds: updateBasketDto.customer_ids,
        //         selectValues: null,
        //         relationAlias: 'customer',
        //         groupBy: 'id',
        //     }),
        // ]);

        // console.log(
        //     test.map((promise) => {
        //         console.log(promise);
        //     }),
        // );

        if (products.length > 0) {
            await this.updateBasketRelations({
                id,
                relationsAlias: 'basket',
                relation: 'products',
                updated_relation: products,
                current_relation: current.products,
            });
        }

        const basket: BasketShort = await this.validateBasketData({
            store_id: updateBasketDto.store_id,
            products,
        });

        if (updateBasketDto.customer_ids.length > 0) {
            const customers: GetCustomerDto[] = await this.findCustomersByIds({
                itemIds: updateBasketDto.customer_ids,
                selectValues: null,
                relationAlias: 'customer',
                groupBy: 'id',
            });

            // If customers_ids length is 1 and arr[0] is equal to 0
            // let's delete customers relation for this basket
            if (
                customers.length > 0 &&
                updateBasketDto.customer_ids.length === 1 &&
                updateBasketDto.customer_ids[0] === 0
            ) {
                await this.deleteBasketRelations({
                    id,
                    relationsAlias: 'basket',
                    relation: 'customers',
                    current_relation: customers,
                });
            }

            if (
                customers.length > 0 &&
                updateBasketDto.customer_ids.length > 0
            ) {
                await this.updateBasketRelations({
                    id,
                    relationsAlias: 'basket',
                    relation: 'customers',
                    updated_relation: customers,
                    current_relation: current.customers,
                });
            }

            try {
                await this.entityManager
                    .getRepository(Basket)
                    .createQueryBuilder('basket')
                    .update()
                    .set(basket)
                    .where('basket.id = :id', { id: id })
                    .execute();

                return await this.findOne({ id });
            } catch (e) {
                return e.message;
            }
        }

        try {
            await this.entityManager
                .getRepository(Basket)
                .createQueryBuilder('basket')
                .update()
                .set(basket)
                .where('basket.id = :id', { id: id })
                .execute();

            return await this.findOne({ id });
        } catch (e) {
            return e.message;
        }
    }

    async remove({ id }: { id: number }): Promise<number> {
        const basket: GetBasketDto = await this.findOne({ id });

        const basket_entity = await this.validateBasketData({
            store_id: basket.store_id,
            products: basket.products,
        });

        await this.deleteBasketRelations({
            id,
            relationsAlias: 'basket',
            relation: 'products',
            current_relation: basket.products,
        });
        await this.deleteBasketRelations({
            id,
            relationsAlias: 'basket',
            relation: 'customers',
            current_relation: basket.customers,
        });
        return (await this.entityManager.delete(Basket, basket_entity))
            .affected;
    }

    private async validateBasketData({
        store_id,
        products,
    }: {
        store_id: number;
        products: GetProductDto[];
    }): Promise<BasketShort> {
        const basket_products = await this.getTotalProductPrice({ products });
        return {
            store_id: store_id,
            basket_final_price: basket_products.total_price,
            product_count: basket_products.products_count,
        };
    }

    private async getTotalProductPrice({
        products,
    }: {
        products: GetProductDto[];
    }): Promise<GetBasketProductResponse> {
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

    private async findProductsByIds({
        itemIds,
        selectValues,
        relationAlias,
        groupBy,
    }: {
        itemIds: number[];
        selectValues: string[];
        relationAlias: string;
        groupBy: string;
    }): Promise<GetProductDto[]> {
        if (selectValues != null) {
            selectValues.map((el) => {
                return `${relationAlias}.${el}`;
            });
        }

        return await this.entityManager
            .createQueryBuilder(Product, relationAlias)
            .select(selectValues)
            .where('id IN (:...ids)', {
                ids: itemIds,
            })
            .groupBy(relationAlias + '.' + groupBy)
            .getMany();
    }

    private async findCustomersByIds({
        itemIds,
        selectValues,
        relationAlias,
        groupBy,
    }: {
        itemIds: number[];
        selectValues: string[];
        relationAlias: string;
        groupBy: string;
    }): Promise<GetCustomerDto[]> {
        if (selectValues != null) {
            selectValues.map((el) => {
                return `${relationAlias}.${el}`;
            });
        }

        return await this.entityManager
            .createQueryBuilder(Customer, relationAlias)
            .select(selectValues)
            .where('id IN (:...ids)', {
                ids: itemIds,
            })
            .groupBy(relationAlias + '.' + groupBy)
            .getMany();
    }

    private async updateBasketRelations({
        id,
        relationsAlias,
        relation,
        updated_relation,
        current_relation,
    }: {
        id: number;
        relationsAlias: string;
        relation: string;
        updated_relation: any[];
        current_relation: any[];
    }): Promise<any> {
        try {
            await this.entityManager
                .getRepository(Basket)
                .createQueryBuilder(relationsAlias)
                .relation(Basket, relation)
                .of(id)
                .addAndRemove(updated_relation, current_relation);
        } catch (e) {
            return e.message;
        }
    }

    private async deleteBasketRelations({
        id,
        relationsAlias,
        relation,
        current_relation,
    }: {
        id: number;
        relationsAlias: 'basket';
        relation: string;
        current_relation: any[];
    }): Promise<any> {
        try {
            await this.entityManager
                .getRepository(Basket)
                .createQueryBuilder(relationsAlias)
                .relation(Basket, relation)
                .of(id)
                .remove(current_relation);
        } catch (e) {
            return e.message;
        }
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

    // Needs to be tested or removed
    private async getDuplicatedIds({
        ids,
    }: {
        ids: number[];
    }): Promise<{ [key: number]: number }> {
        return ids.reduce<{ [key: number]: number }>((a, e) => {
            a[e] = ++a[e] || 0;
            return a;
        }, {});
    }

    // Needs to be tested or removed
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
}
