import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';

@Module({
  imports: [OrderModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
