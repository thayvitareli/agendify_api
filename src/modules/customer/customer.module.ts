import { Module } from '@nestjs/common';
import { CustomerController } from './presentation/controllers/customer.controller';

@Module({
  controllers: [CustomerController],
})
export class CustomerModule {}
