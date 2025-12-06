import { Module } from '@nestjs/common';
import { BarbershopServiceController } from './presentation/controller/barbershop-service.controller';

@Module({
  controllers: [BarbershopServiceController],
})
export class BarbershopModule {}
