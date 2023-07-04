import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DefaultOrderProductDto } from './dto/enum/enum-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    async create(createProductDto: CreateProductDto): Promise<GetProductDto> {
        const exist = await this.entityManager.findOne(Product, {
            where: {
                sku: createProductDto.sku,
            },
            select: ['sku'],
        });

        if (exist && exist.sku != null) {
            return exist;
        }

        if (createProductDto.sku != null) {
            const product = this.entityManager.create(
                Product,
                createProductDto,
            );
            return await this.entityManager.save(Product, product);
        }

        return null;
    }

    findAll() {
        return `This action returns all product`;
    }

    findOne(id: number) {
        return `This action returns a #${id} product`;
    }

    async getDefaultProduct(): Promise<GetProductDto> {
        return {
            id: Number(DefaultOrderProductDto.id),
            sku: DefaultOrderProductDto.sku.toString(),
            product_type: Number(DefaultOrderProductDto.product_type),
            visibility: Number(DefaultOrderProductDto.visibility),
            quantity: Number(DefaultOrderProductDto.qty),
            final_price: Number(DefaultOrderProductDto.final_price),
            store_id: Number(DefaultOrderProductDto.store_id),
        };
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`;
    }

    remove(id: number) {
        return `This action removes a #${id} product`;
    }
}
