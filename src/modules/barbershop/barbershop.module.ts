import { Module } from '@nestjs/common';
import { BarbershopController } from './presentation/controller/barbershop.controller';

@Module({
  controllers: [BarbershopController],
})
export class BarbershopModule {}
