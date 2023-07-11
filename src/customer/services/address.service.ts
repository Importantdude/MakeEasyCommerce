import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateAddressDto } from '../dto/address/create-address.dto';
import {
    GetAddressDetailsDto,
    GetAddressDto,
    GetDetailsDto,
} from '../dto/address/get-address.dto';
import { Address } from '../entities/address.entity';
import { UpdateAddressDetailsDto } from '../dto/address/update-address.dto';
import { Details } from '../entities/details.entity';

@Injectable()
export class AddressService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    async create({
        createAddressDto,
    }: {
        createAddressDto: CreateAddressDto;
    }): Promise<GetAddressDetailsDto> {
        console.log('here');
        const test = this.entityManager.create(Address, createAddressDto);
        console.log(test);
        return await this.entityManager.save(Address, test);
    }

    async findAll(): Promise<GetAddressDto[]> {
        try {
            return await this.entityManager
                .getRepository(Address)
                .createQueryBuilder('address')
                .getMany();
        } catch (e) {
            return e.message;
        }
    }

    async findAllAddressesDetails(): Promise<GetAddressDetailsDto[]> {
        try {
            return await this.entityManager
                .getRepository(Address)
                .createQueryBuilder('address')
                .leftJoinAndSelect('address.details', 'details')
                .getMany();
        } catch (e) {
            return e.message;
        }
    }

    async update({
        id,
        updateAddressDto,
    }: {
        id: number;
        updateAddressDto: UpdateAddressDetailsDto;
    }): Promise<any> {
        try {
            console.log('tried');
            const address = await this.entityManager
                .getRepository(Address)
                .createQueryBuilder('address')
                .leftJoinAndSelect('address.details', 'details')
                .where('address.id = :id', { id: id })
                .select(['address', 'details.id'])
                .getOne();

            console.log('updateAddressDto');
            console.log(updateAddressDto);
            const new_entity: GetAddressDetailsDto = {
                id: id,
                ...this.entityManager.create(Address, updateAddressDto),
            };
            new_entity.details.id = address.details.id;
            console.log('new_entity');
            console.log(new_entity);
            return this.entityManager.save(Address, new_entity);
        } catch (e) {
            return e.message;
        }
    }

    // Find way to retrieve only address (OneToOne) -> details.id
    // Smth with ".select()"... review query that is generated
    // using .select to understand why it did not work...
    async remove({ id }: { id: number }): Promise<any> {
        try {
            const address = await this.entityManager
                .getRepository(Address)
                .createQueryBuilder('address')
                .leftJoinAndSelect('address.details', 'details')
                .where('address.id = :id', { id: id })
                .getOne();
            return await this.entityManager.delete(Details, address.details.id);
        } catch (e) {
            return e.message;
        }
    }
}
