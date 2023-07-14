import { Injectable } from '@nestjs/common';
import { EntityManager, IsNull } from 'typeorm';
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
    UpdateCustomerAddressDetailsDto,
    UpdateCustomerAddressDto,
    UpdateCustomerDto,
} from '../dto/update-customer.dto';
import { UpdateAddressDetailsDto } from '../dto/address/update-address.dto';
import { AddressService } from './address.service';
import { Details } from '../entities/details.entity';
import { IsEmail, isEmpty } from 'class-validator';
import { CustomerEntity } from '../interfaces/customer.interface';

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
        updateCustomer: UpdateCustomerAddressDetailsDto;
    }): Promise<any> {
        updateCustomer.id = id;
        const current: GetCustomerAddressDetailsDto = await this.findOne({
            id: id,
            address: true,
            details: true,
        });
        if (updateCustomer === undefined) {
            throw 'update customer dto body is empty';
        }

        const customer_entity: GetCustomerAddressDetailsDto = {
            ...updateCustomer,
        };

        delete customer_entity.address;

        // New Address + update customer
        if (current.address_ids.length === 0) {
            console.log('We created new address record and update customer');
            // const customer_entity: GetCustomerAddressDetailsDto = {
            //     ...updateCustomer,
            // };

            // delete customer_entity.address;
            const addresses: GetAddressDetailsDto[] =
                await this.entityManager.save(Address, updateCustomer.address);

            // SMTH For Uncle GOOGLE or Aunt GPT
            // each next request relies on result of action of previous await
            // except maybe for first one P.S. not sure
            // They are running in parallel
            // My preferable expectations ->
            // order of Promise object, but looks like always the same
            // I expect for "findOneBuy" to get updated data from "update"
            // which also supposed by that time include updated
            // relation ids from "updateCustomerRelations"
            //
            // Currently logical seems that this needs to
            // separated from "Promise.all()"
            // But so I would not forget to get answer's on my questions
            // I'll just leave it here working with ".Promise.all()"
            // With extremely big comment so it will annoy me every time I see it
            // Simply because for current state of project works just fine
            // also, according to what wrote before,
            // I have no clue why it's working then...

            return (
                await Promise.all([
                    await this.updateCustomerRelations({
                        id,
                        relation: 'address',
                        updated_relation: addresses,
                        current_relation: current.address,
                    }),
                    await this.update({
                        id: id,
                        updateCustomerDto: customer_entity,
                    }),
                    await this.findOneBy({
                        filter: 'id',
                        value: id,
                        address: true,
                        details: true,
                    }),
                ])
            ).slice(-1);
        }

        // To update current customer together with
        // it's existing Address together or separate from Details record
        // I need to have at least address_index record id
        // hope one day I'll wake up with genius solution
        // address_id is mandatory for now...
        if (
            (updateCustomer.address_ids === undefined ||
                updateCustomer.address_ids.shift() === 0) &&
            current.address_ids.length > 0
        ) {
            await Promise.all([
                updateCustomer.address.map(async (address) => {
                    if (address.id != undefined) {
                        await this.addressService.update({
                            id: address.id,
                            updateAddressDto: address,
                        });
                    }
                }),
                await this.update({
                    id: id,
                    updateCustomerDto: customer_entity,
                }),
            ]);
            return;
        }

        console.log('none');
        return null;
    }

    async deleteCustomerAddressRelation({
        id,
        address_ids,
    }: {
        id: number;
        address_ids: number[];
    }): Promise<any> {
        console.log(id);
        console.log(address_ids);
        const res = [];

        // this will delete all customer addresses
        if (address_ids === undefined) {
            const customer_address = await this.entityManager
                .getRepository(Address)
                .createQueryBuilder('address')
                .leftJoinAndSelect('address.customer', 'customer')
                .select(['address.id', 'customer.id'])
                .where('customer.id = :id', { id: id })
                .getMany();

            // SMTH For Uncle GOOGLE or Aunt GPT
            // I want to know
            // If it's worth if looping with Promise.all?
            // Currently have 2 conditions
            // Promise inside the loop, cuz loop works pretty fast
            // and maybe sending this request in parallel might be more efficient???
            // or Looping without promise, but using await.. I need result of remove action
            // at some point this supposed to be helpful for debugging
            // to see actual state of address body under this id
            try {
                customer_address.map(async (address_id) => {
                    console.log(`Lets delete address with id ->${address_id}`);
                    // await Promise.all([
                    const result = await this.addressService.remove({
                        id: address_id.id,
                    });
                    if (!result) {
                        res.push(address_id);
                    }
                });

                if (res.length === 0) {
                    return true;
                }
            } catch (e) {
                return res;
            }
        }

        try {
            address_ids.map(async (address_id) => {
                console.log(`Lets delete address with id ->${address_id}`);
                // await Promise.all([
                const result = await this.addressService.remove({
                    id: address_id,
                });
                if (!result) {
                    res.push(address_id);
                }
            });

            if (res.length === 0) {
                return true;
            }
        } catch (e) {
            return res;
        }
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
        console.log('updated_relation');
        console.log(updated_relation);
        console.log('current_relation');
        console.log(current_relation);
        try {
            return await this.entityManager
                .getRepository(Customer)
                .createQueryBuilder('customer')
                .relation(Customer, relation)
                .of(id)
                .addAndRemove(updated_relation, current_relation);
        } catch (e) {
            return e.message;
        }
    }
}
