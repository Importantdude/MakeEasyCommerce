import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { BasketModule } from './basket/basket.module';
import { ProductModule } from './product/product.module';
import { AttributesModule } from './attributes/attributes.module';

@Module({
  imports: [OrderModule, UserModule, BasketModule, ProductModule, AttributesModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
