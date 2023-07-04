import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DefaultOrderProductDto } from './dto/enum/enum-product.dto';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductService {
    create(createProductDto: CreateProductDto) {
        return 'This action adds a new product';
    }

    findAll() {
        return `This action returns all product`;
    }

    findOne(id: number) {
        return `This action returns a #${id} product`;
    }

    async getDefaultProduct(): Promise<GetProductDto> {
        return {
            product_id: Number(DefaultOrderProductDto.product_id),
            sku: DefaultOrderProductDto.sku.toString(),
            visibility: Boolean(DefaultOrderProductDto.visibility),
            qty: Number(DefaultOrderProductDto.qty),
            final_price: Number(DefaultOrderProductDto.final_price),
        };
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`;
    }

    remove(id: number) {
        return `This action removes a #${id} product`;
    }
}
