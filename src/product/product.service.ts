import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DefaultOrderProductDto } from './dto/enum/enum-product.dto';
import { GetProductDto, GetProductShortDto } from './dto/get-product.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    // Create Product with main entity schema
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

    // Get All Products with main entity schema
    async findAll(): Promise<GetProductShortDto[]> {
        return await this.entityManager
            .createQueryBuilder(Product, 'product')
            .getMany();
    }

    // Find one Product with main entity schema
    async findOne(id: number): Promise<GetProductShortDto> {
        try {
            return await this.entityManager.findOneOrFail(Product, {
                where: { id: id },
            });
        } catch (e) {
            return e.message;
        }
    }

    // Get Default Product with main entity schema
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

    // Update Customer
    async update(
        updateProductDto: UpdateProductDto,
    ): Promise<GetProductShortDto> {
        const partialEntityProduct: UpdateProductDto = {
            id: updateProductDto.id,
            ...updateProductDto,
        };

        const product: GetProductShortDto = await this.entityManager.preload(
            Product,
            partialEntityProduct,
        );

        try {
            if (this.entityManager.hasId(product)) {
                return (
                    await this.entityManager.update(
                        Product,
                        updateProductDto.id,
                        product,
                    )
                ).raw;
            }
        } catch (e) {
            return e.message;
        }
    }

    // Delete Product
    async remove(id: number): Promise<number> {
        try {
            return (await this.entityManager.delete(Product, id)).affected;
        } catch (e) {
            return e.message;
        }
    }
}
