import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
    GetCustomerAddressDetailsDto,
    GetCustomerAddressDto,
    GetCustomerDto,
} from '../dto/get-customer.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from '../entities/customer.entity';
import { Address } from '../entities/address.entity';
import {
    GetAddressDetailsDto,
    GetAddressDto,
} from '../dto/address/get-address.dto';
import {
    UpdateCustomerAddressDto,
    UpdateCustomerDto,
} from '../dto/update-customer.dto';
import { UpdateAddressDetailsDto } from '../dto/address/update-address.dto';
import { AddressService } from './address.service';
import { Details } from '../entities/details.entity';

@Injectable()
export class CustomerService {
    constructor(
        private readonly addressService: AddressService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    async create({
        createCustomerDto,
    }: {
        createCustomerDto: CreateCustomerDto;
    }): Promise<GetCustomerDto> {
        // Add validation in case if user already exists!
        // If it's needed, cuz right now
        // I'm saving all emails and
        // I don't have unique indicators
        const customer = this.entityManager.create(Customer, createCustomerDto);
        return await this.entityManager.save(Customer, customer);
    }

    async findAll({
        address,
        details,
    }: {
        address: boolean;
        details: boolean;
    }): Promise<GetCustomerDto[]> {
        const where = {
            filter: '',
            value: null,
        };
        const relations = {
            address: address,
            details: details,
        };
        try {
            return await this.findCustomerQuery({
                where,
                relations,
                many: true,
            });
        } catch (e) {
            return e.message;
        }
    }

    async findOne({
        id,
        address,
        details,
    }: {
        id: number;
        address: boolean;
        details: boolean;
    }): Promise<GetCustomerAddressDetailsDto> {
        const where = {
            filter: 'id',
            value: id,
        };
        try {
            return (
                await this.findCustomerQuery({
                    where,
                    relations: { address: address, details: details },
                    many: false,
                })
            ).shift();
        } catch (e) {
            return e.message;
        }
    }

    async findOneBy({
        filter,
        value,
        address,
        details,
    }: {
        filter: string;
        value: any;
        address: boolean;
        details: boolean;
    }): Promise<any> {
        try {
            return (
                await this.findCustomerQuery({
                    where: {
                        filter: filter,
                        value: value,
                    },
                    relations: {
                        address: address,
                        details: details,
                    },
                    many: false,
                })
            ).shift();
        } catch (e) {
            return e.message;
        }
    }

    async update({
        id,
        updateCustomerDto,
    }: {
        id: number;
        updateCustomerDto: UpdateCustomerDto;
    }): Promise<any> {
        return await this.entityManager
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .innerJoin('customer.address', 'address')
            .innerJoin('address.details', 'details')
            .update(Customer)
            .where('id = :id', { id: id })
            .set(updateCustomerDto)
            .execute();
    }

    async updateCustomerAddressDetails({
        id,
        updateCustomer,
    }: {
        id: number;
        updateCustomer: UpdateCustomerAddressDto;
    }): Promise<any> {
        const current: GetCustomerAddressDetailsDto = await this.findOne({
            id: id,
            address: true,
            details: true,
        });
        console.log(
            'address exists and should be only updated together with customer',
        );

        if (
            updateCustomer.address_ids &&
            updateCustomer.address_ids.length > 0
        ) {
            console.log('records needs to removed from relation');
            // if provided array of address id's, then
            // means some of them should be removed from this customer
            const difference = current.address_ids.filter(
                (item) => updateCustomer.address_ids.indexOf(item) < 0,
            );
            const address_id: number = difference.shift();
            if (difference) {
                // console.log(...difference);
                await this.addressService.remove({
                    id: address_id,
                });
            }
        }

        return null;
    }

    protected async findCustomerQuery({
        where,
        relations,
        many,
    }: {
        where: {
            filter: string;
            value: any;
        };
        relations: {
            address: boolean;
            details: boolean;
        };
        many: boolean;
    }): Promise<any[]> {
        let condition = '';
        let query = null;
        if (where.filter && where.value) {
            condition = 'customer.' + where.filter + ' = :' + where.filter;
            query = {};
            query[where.filter] = where.value;
        }

        if (!many && relations.details) {
            return [
                await this.entityManager
                    .getRepository(Customer)
                    .createQueryBuilder('customer')
                    .leftJoinAndSelect('customer.address', 'address')
                    .leftJoinAndSelect('address.details', 'details')
                    .where(condition, query)
                    .getOne(),
            ];
        }

        if (!many && relations.address) {
            return [
                await this.entityManager
                    .getRepository(Customer)
                    .createQueryBuilder('customer')
                    .leftJoinAndSelect('customer.address', 'address')
                    .where(condition, query)
                    .getOne(),
            ];
        }

        if (many && relations.details) {
            return await this.entityManager
                .getRepository(Customer)
                .createQueryBuilder('customer')
                .leftJoinAndSelect('customer.address', 'address')
                .leftJoinAndSelect('address.details', 'details')
                .where(condition, query)
                .getMany();
        }

        if (many && relations.address) {
            return await this.entityManager
                .getRepository(Customer)
                .createQueryBuilder('customer')
                .leftJoinAndSelect('customer.address', 'address')
                .where(condition, query)
                .getMany();
        }

        return await this.entityManager
            .getRepository(Customer)
            .createQueryBuilder('customer')
            .where(condition, query)
            .getMany();
    }

    protected async updateCustomerRelations({
        id,
        relation,
        updated_relation,
        current_relation,
    }: {
        id: number;
        relation: string;
        updated_relation: any[];
        current_relation: any[];
    }): Promise<any> {
        try {
            await this.entityManager
                .getRepository(Customer)
                .createQueryBuilder('customer')
                .relation(Customer, relation)
                .of(id)
                .addAndRemove(updated_relation, current_relation);
        } catch (e) {
            return e.message;
        }
    }

    private async findAddressDetailsByIds({
        itemIds,
        selectValues,
        groupBy,
    }: {
        itemIds: number[];
        selectValues: string[];
        groupBy: string;
    }): Promise<GetAddressDetailsDto[]> {
        if (selectValues != null) {
            selectValues.map((el) => {
                return `${'address'}.${el}`;
            });
        }
        return await this.entityManager
            .getRepository(Address)
            .createQueryBuilder('address')
            .leftJoinAndSelect('address.details', 'details')
            .select(selectValues)
            .where('address.id IN (:...ids)', {
                ids: itemIds,
            })
            // .groupBy(groupBy)
            .getMany();
    }
}
