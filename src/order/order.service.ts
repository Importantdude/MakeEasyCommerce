import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { DefaultOrderDto } from './dto/enum/enum-order.dto';
import { BasketService } from 'src/basket/basket.service';
import { CustomerService } from '@src/customer/services/customer.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GetBasketDto } from '@src/basket/dto/get-basket.dto';
import { Basket } from '@src/basket/entities/basket.entity';
import { Order } from './entities/order.entity';
import { GetCustomerDto } from '@src/customer/dto/get-customer.dto';
import { Customer } from '@src/customer/entities/customer.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    async create({
        createOrderDto,
    }: {
        createOrderDto: CreateOrderDto;
    }): Promise<GetOrderDto> {
        if (createOrderDto.order_type != 0) {
            const baskets: GetBasketDto[] = await this.findBasketsByIds({
                itemIds: createOrderDto.baskets_ids,
                selectValues: null,
                groupBy: 'id',
            });

            const basketIds: number[] = baskets.map((el) => {
                return el.id;
            });

            if (basketIds.length != createOrderDto.baskets_ids.length) {
                throw 'Baskets are empty';
            }

            const customers: GetCustomerDto[] = await this.findCustomersByIds({
                itemIds: createOrderDto.baskets_ids,
                selectValues: null,
                groupBy: 'id',
            });

            const customerIds: number[] = customers.map((el) => {
                return 1;
            });

            if (customerIds.length != createOrderDto.customers_ids.length) {
                throw 'customers are empty';
            }

            const order: CreateOrderDto = {
                baskets: baskets,
                baskets_ids: createOrderDto.baskets_ids,
                customers: customers,
                customers_ids: createOrderDto.customers_ids,
                ...this.entityManager.create(Order, createOrderDto),
            };

            try {
                return await this.entityManager.save(Order, order);
            } catch (e) {
                return e.message;
            }
        }
    }

    findAll() {
        return `This action returns all order`;
    }

    findOne(id: number) {
        return `This action returns a #${id} order`;
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return `This action updates a #${id} order`;
    }

    remove(id: number) {
        return `This action removes a #${id} order`;
    }

    private async findBasketsByIds({
        itemIds,
        selectValues,
        groupBy,
    }: {
        itemIds: number[];
        selectValues: string[];
        groupBy: string;
    }): Promise<GetBasketDto[]> {
        const relationAlias = 'basket';
        if (selectValues != null) {
            selectValues.map((el) => {
                return `${relationAlias}.${el}`;
            });
        }

        return await this.entityManager
            .createQueryBuilder(Basket, relationAlias)
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
        groupBy,
    }: {
        itemIds: number[];
        selectValues: string[];
        groupBy: string;
    }): Promise<GetCustomerDto[]> {
        const relationAlias = 'customer';
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

    async getDefaultOrder(): Promise<GetOrderDto> {
        // const basket = await this.basketService.getDefaultBasket();
        // const address = await this.customerService.getDefaultCustomerAddress();

        // return {
        //   order_type: DefaultOrderDto.order_type.toString(),
        //   basket: [basket],
        //   shipping_address: [address],
        //   payment_address: [address]
        // }
        return null;
    }
}
