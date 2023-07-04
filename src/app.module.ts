import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { BasketModule } from './basket/basket.module';
import { ProductModule } from './product/product.module';
import { AttributesModule } from './attributes/attributes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer/entities/customer.entity';
import { CustomerAddress } from './customer/entities/customer-address.entity';
import { CustomerAddressDetails } from './customer/entities/customer-address-detailed.entity';
import { Product } from './product/entities/product.entity';

@Module({
    imports: [
        CustomerModule,
        BasketModule,
        ProductModule,
        AttributesModule,
        OrderModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.TYPEORM_HOST,
            port: 5432,
            database: process.env.TYPEORM_DATABASE,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            entities: [
                Customer,
                CustomerAddress,
                CustomerAddressDetails,
                Product,
            ],
            migrations: ['dist/migrations/*.{ts,js}'],
            migrationsTableName: 'typeorm_migrations',
            logger: 'file',
            synchronize: true, // never use TRUE in production!
        }),
    ],
    controllers: [],
    providers: [AppService],
})
export class AppModule {}
