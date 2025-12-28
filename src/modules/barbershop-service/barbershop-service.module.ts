import { Module } from '@nestjs/common';
import { BarbershopServiceController } from './presentation/controller/barbershop-service.controller';
import { TypeORMBarbershopServiceRepository } from './infrastructure/repositories/typeorm-barbershop-service.repository';
import { TypeORMBarbershopRepository } from '../barbershop/infrastructure/repositories/typeorm-barbershop.repository';
import { RegisterServiceUseCase } from './use-cases/register-service.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbershopServiceEntity } from './infrastructure/entity/barbershop-service.entity';
import { BarbershopEntity } from '../barbershop/infrastructure/entity/barbershop.entity';

@Module({
  controllers: [BarbershopServiceController],
  imports: [TypeOrmModule.forFeature([BarbershopEntity, BarbershopServiceEntity])],
  providers: [
    RegisterServiceUseCase,
    {
      provide: 'IBarbershopServiceRepository',
      useClass: TypeORMBarbershopServiceRepository,
    },
    {
      provide: 'IBarbershopRepository',
      useClass: TypeORMBarbershopRepository,
    },
  ],
})
export class BarbershopServiceModule {}
