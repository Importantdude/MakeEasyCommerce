import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Basket])],
    controllers: [BasketController],
    providers: [BasketService],
})
export class BasketModule {}
